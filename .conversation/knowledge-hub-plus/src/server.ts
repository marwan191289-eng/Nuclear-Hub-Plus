import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

const CLERK_PROXY_PATH = "/api/__clerk";
const CLERK_FRONTEND_API = "https://frontend-api.clerk.dev";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      if (process.env["NODE_ENV"] === "production" && isClerkProxyRequest(request)) {
        return await proxyClerkRequest(request);
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

function isClerkProxyRequest(request: Request) {
  const path = new URL(request.url).pathname;
  return path === CLERK_PROXY_PATH || path.startsWith(`${CLERK_PROXY_PATH}/`);
}

async function proxyClerkRequest(request: Request): Promise<Response> {
  const secretKey = process.env["CLERK_SECRET_KEY"];
  if (!secretKey) {
    return new Response("Authentication proxy is not configured.", { status: 503 });
  }

  const incomingUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || incomingUrl.host;
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || incomingUrl.protocol.replace(":", "");
  const proxyUrl = `${protocol}://${host}${CLERK_PROXY_PATH}`;
  const upstreamUrl = new URL(
    `${incomingUrl.pathname.slice(CLERK_PROXY_PATH.length)}${incomingUrl.search}`,
    CLERK_FRONTEND_API,
  );

  const headers = new Headers(request.headers);
  for (const name of ["connection", "content-length", "host", "keep-alive", "transfer-encoding"]) {
    headers.delete(name);
  }
  headers.set("Clerk-Proxy-Url", proxyUrl);
  headers.set("Clerk-Secret-Key", secretKey);

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (clientIp) headers.set("X-Forwarded-For", clientIp);

  try {
    const upstreamRequest: RequestInit = {
      method: request.method,
      headers,
      redirect: "manual",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      upstreamRequest.body = await request.arrayBuffer();
    }
    const upstream = await fetch(upstreamUrl, {
      ...upstreamRequest,
    });

    const responseHeaders = new Headers(upstream.headers);
    for (const name of ["connection", "keep-alive", "transfer-encoding"]) {
      responseHeaders.delete(name);
    }

    const bodyless =
      request.method === "HEAD" ||
      upstream.status < 200 ||
      upstream.status === 204 ||
      upstream.status === 304;
    if (bodyless) responseHeaders.delete("content-length");

    const responseBody = bodyless ? null : await upstream.arrayBuffer();
    if (responseBody) {
      responseHeaders.delete("content-encoding");
      responseHeaders.set("content-length", String(responseBody.byteLength));
    }

    return new Response(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Clerk frontend API proxy request failed", error);
    return new Response("Authentication service is temporarily unavailable.", {
      status: 502,
    });
  }
}
