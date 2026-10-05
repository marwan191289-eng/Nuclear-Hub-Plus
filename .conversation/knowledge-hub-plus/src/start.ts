import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";
import { clerkMiddleware } from "@clerk/tanstack-react-start/server";
import { publishableKeyFromHost } from "@clerk/react/internal";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [
    errorMiddleware,
    clerkMiddleware(({ url }) => {
      const secretKey = process.env["CLERK_SECRET_KEY"];
      const proxyUrl = process.env["VITE_CLERK_PROXY_URL"];
      return {
        publishableKey: publishableKeyFromHost(
          url.hostname,
          process.env["CLERK_PUBLISHABLE_KEY"],
        ),
        ...(secretKey ? { secretKey } : {}),
        ...(proxyUrl ? { proxyUrl } : {}),
        signInUrl: "/sign-in",
        signUpUrl: "/sign-up",
      };
    }),
    csrfMiddleware,
  ],
}));
