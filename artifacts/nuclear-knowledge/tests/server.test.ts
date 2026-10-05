import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, describe, it } from "node:test";

process.env.VERCEL = "1";
process.env.ADMIN_PASSWORD = "test-only-admin-password";
process.env.SESSION_SECRET = "test-only-session-signing-key-with-more-than-32-bytes";

const { app, calculateRealisticStudentCount } = await import("../server");
const server = createServer(app);
let baseUrl = "";

before(async () => {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("administrator authentication", () => {
  it("does not expose student records to an unauthenticated request", async () => {
    const response = await fetch(`${baseUrl}/api/admin/students`);
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  });

  it("rejects an incorrect password", async () => {
    const response = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "incorrect-test-password" }),
    });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("set-cookie"), null);
  });

  it("creates a signed, HTTP-only session and authorizes protected records", async () => {
    const login = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
    });
    assert.equal(login.status, 200);
    assert.deepEqual(await login.json(), { authenticated: true });

    const setCookie = login.headers.get("set-cookie");
    assert.ok(setCookie);
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=Strict/i);
    assert.match(setCookie, /Secure/i);
    const cookie = setCookie.split(";")[0];

    const records = await fetch(`${baseUrl}/api/admin/students`, {
      headers: { Cookie: cookie },
    });
    assert.equal(records.status, 200);
    assert.equal(records.headers.get("cache-control"), "private, no-store");
    assert.ok(Array.isArray(await records.json()));

    const parentReport = await fetch(`${baseUrl}/api/admin/parent-report`, {
      headers: { Cookie: cookie },
    });
    assert.equal(parentReport.status, 200);

    const logout = await fetch(`${baseUrl}/api/admin/logout`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    assert.equal(logout.status, 204);
    assert.match(logout.headers.get("set-cookie") ?? "", /Max-Age=0/);
  });

  it("fails closed when the admin password is not configured", async () => {
    const configuredPassword = process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PASSWORD;
    try {
      const response = await fetch(`${baseUrl}/api/admin/session`);
      assert.equal(response.status, 503);
    } finally {
      process.env.ADMIN_PASSWORD = configuredPassword;
    }
  });
});

describe("public platform stats", () => {
  it("caps every hourly increase at three and exposes the requested 12+ experience", async () => {
    const epoch = Date.UTC(2026, 9, 5, 0, 0, 0);
    let previousCount = calculateRealisticStudentCount(epoch).count;

    for (let hour = 1; hour <= 24 * 30; hour += 1) {
      const stats = calculateRealisticStudentCount(epoch + hour * 60 * 60 * 1000);
      const increase = stats.count - previousCount;
      assert.ok(increase >= 0 && increase <= 3, `hour ${hour} increased by ${increase}`);
      assert.ok(stats.lastHourIncrease >= 0 && stats.lastHourIncrease <= 3);
      previousCount = stats.count;
    }

    const response = await fetch(`${baseUrl}/api/stats`);
    assert.equal(response.status, 200);
    const stats = await response.json() as { experienceYears: string; lastHourIncrease: number };
    assert.equal(stats.experienceYears, "12+");
    assert.ok(stats.lastHourIncrease >= 0 && stats.lastHourIncrease <= 3);
  });
});
