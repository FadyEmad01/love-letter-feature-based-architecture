import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { config, proxy } from "../proxy";

vi.mock("better-auth/cookies", () => ({
  getSessionCookie: vi.fn(),
}));

import { getSessionCookie } from "better-auth/cookies";

const mockGetSessionCookie = vi.mocked(getSessionCookie);

function createDashboardRequest(path = "/dashboard"): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

function createAuthPageRequest(
  path: "/auth/login" | "/auth/register",
): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("proxy middleware", () => {
  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.MAINTENANCE_MODE;
  });

  describe("authentication guard", () => {
    it("redirects to /auth/login when no session cookie", async () => {
      mockGetSessionCookie.mockReturnValue(null);

      const response = await proxy(createDashboardRequest());

      expect(mockGetSessionCookie).toHaveBeenCalledOnce();
      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/auth/login",
      );
    });

    it("passes through when session cookie exists", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session-token");

      const response = await proxy(createDashboardRequest());

      expect(mockGetSessionCookie).toHaveBeenCalledOnce();
      expect(response.status).toBe(200);
    });
  });

  describe("auth page protection", () => {
    it("redirects logged-in user away from /auth/login to /dashboard", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session-token");

      const response = await proxy(createAuthPageRequest("/auth/login"));

      expect(mockGetSessionCookie).toHaveBeenCalledOnce();
      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard",
      );
    });

    it("redirects logged-in user away from /auth/register to /dashboard", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session-token");

      const response = await proxy(createAuthPageRequest("/auth/register"));

      expect(mockGetSessionCookie).toHaveBeenCalledOnce();
      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard",
      );
    });

    it("allows unauthenticated user to access /auth/login", async () => {
      mockGetSessionCookie.mockReturnValue(null);

      const response = await proxy(createAuthPageRequest("/auth/login"));

      expect(response.status).toBe(200);
    });

    it("allows unauthenticated user to access /auth/register", async () => {
      mockGetSessionCookie.mockReturnValue(null);

      const response = await proxy(createAuthPageRequest("/auth/register"));

      expect(response.status).toBe(200);
    });
  });

  describe("redirect behavior", () => {
    it("redirects to the correct login origin for the request", async () => {
      mockGetSessionCookie.mockReturnValue(null);

      const request = new NextRequest(
        new URL("https://example.com/dashboard/settings"),
      );
      const response = await proxy(request);

      expect(response.headers.get("location")).toBe(
        "https://example.com/auth/login",
      );
    });

    it("passes the request to getSessionCookie", async () => {
      mockGetSessionCookie.mockReturnValue("abc123");

      const request = createDashboardRequest("/dashboard/reports");
      await proxy(request);

      expect(mockGetSessionCookie).toHaveBeenCalledWith(request);
    });
  });

  describe("maintenance mode", () => {
    it("redirects to /maintenance when MAINTENANCE_MODE is true", async () => {
      process.env.MAINTENANCE_MODE = "true";
      mockGetSessionCookie.mockReturnValue(null);

      const response = await proxy(createDashboardRequest("/dashboard"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/maintenance",
      );
    });

    it("allows access to /maintenance during maintenance mode", async () => {
      process.env.MAINTENANCE_MODE = "true";

      const response = await proxy(createDashboardRequest("/maintenance"));

      expect(response.status).toBe(200);
    });

    it("allows access to /maintenance even without maintenance mode", async () => {
      mockGetSessionCookie.mockReturnValue(null);

      const response = await proxy(createDashboardRequest("/maintenance"));

      expect(response.status).toBe(200);
    });

    it("does not redirect when MAINTENANCE_MODE is not set", async () => {
      mockGetSessionCookie.mockReturnValue(null);

      const response = await proxy(createDashboardRequest("/dashboard"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/auth/login",
      );
    });

    it("does not redirect when MAINTENANCE_MODE is 'false'", async () => {
      process.env.MAINTENANCE_MODE = "false";
      mockGetSessionCookie.mockReturnValue(null);

      const response = await proxy(createDashboardRequest("/dashboard"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/auth/login",
      );
    });
  });

  describe("config", () => {
    it("targets all routes except static assets and API", () => {
      expect(config.matcher).toEqual([
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
      ]);
    });
  });
});
