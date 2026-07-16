import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { config, proxy } from "../proxy";

vi.mock("better-auth/cookies", () => ({
  getSessionCookie: vi.fn(),
}));

import { getSessionCookie } from "better-auth/cookies";

const mockGetSessionCookie = vi.mocked(getSessionCookie);

function createRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("proxy middleware", () => {
  afterEach(() => {
    vi.resetAllMocks();
    delete process.env.MAINTENANCE_MODE;
  });

  // ─── Maintenance mode ────────────────────────────────────
  describe("maintenance mode", () => {
    it("redirects to /maintenance when MAINTENANCE_MODE is 'true'", async () => {
      process.env.MAINTENANCE_MODE = "true";

      const response = await proxy(createRequest("/dashboard"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/maintenance",
      );
    });

    it("redirects to /maintenance even when session exists", async () => {
      process.env.MAINTENANCE_MODE = "true";
      mockGetSessionCookie.mockReturnValue("valid-session");

      const response = await proxy(createRequest("/dashboard"));

      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/maintenance",
      );
    });

    it("allows access to /maintenance during maintenance mode", async () => {
      process.env.MAINTENANCE_MODE = "true";

      const response = await proxy(createRequest("/maintenance"));

      expect(response.status).toBe(200);
    });

    it("redirects /maintenance to / when MAINTENANCE_MODE is not set", async () => {
      const response = await proxy(createRequest("/maintenance"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("redirects /maintenance to / when MAINTENANCE_MODE is 'false'", async () => {
      process.env.MAINTENANCE_MODE = "false";

      const response = await proxy(createRequest("/maintenance"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("does not redirect other routes when MAINTENANCE_MODE is not set", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session");

      const response = await proxy(createRequest("/dashboard"));

      expect(response.status).toBe(200);
    });

    it("does not redirect other routes when MAINTENANCE_MODE is 'false'", async () => {
      process.env.MAINTENANCE_MODE = "false";
      mockGetSessionCookie.mockReturnValue("valid-session");

      const response = await proxy(createRequest("/dashboard"));

      expect(response.status).toBe(200);
    });
  });

  // ─── Public routes ───────────────────────────────────────
  describe("public routes", () => {
    it("allows unauthenticated user to access / (landing page)", async () => {
      const response = await proxy(createRequest("/"));

      expect(response.status).toBe(200);
    });

    it("allows authenticated user to access / (landing page)", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session");

      const response = await proxy(createRequest("/"));

      expect(response.status).toBe(200);
    });

    it("allows unauthenticated user to access /auth/login", async () => {
      const response = await proxy(createRequest("/auth/login"));

      expect(response.status).toBe(200);
    });

    it("allows unauthenticated user to access /auth/register", async () => {
      const response = await proxy(createRequest("/auth/register"));

      expect(response.status).toBe(200);
    });
  });

  // ─── Auth page protection ────────────────────────────────
  describe("auth page protection", () => {
    it("redirects logged-in user from /auth/login to /dashboard", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session");

      const response = await proxy(createRequest("/auth/login"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard",
      );
    });

    it("redirects logged-in user from /auth/register to /dashboard", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session");

      const response = await proxy(createRequest("/auth/register"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard",
      );
    });
  });

  // ─── Protected routes ────────────────────────────────────
  describe("protected routes", () => {
    it("redirects to /auth/login when no session cookie", async () => {
      const response = await proxy(createRequest("/dashboard"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/auth/login",
      );
    });

    it("passes through when session cookie exists", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session");

      const response = await proxy(createRequest("/dashboard"));

      expect(response.status).toBe(200);
    });

    it("redirects to the correct origin for the request", async () => {
      const request = new NextRequest(
        new URL("https://example.com/dashboard/settings"),
      );
      const response = await proxy(request);

      expect(response.headers.get("location")).toBe(
        "https://example.com/auth/login",
      );
    });
  });

  // ─── Config ──────────────────────────────────────────────
  describe("config", () => {
    it("targets all routes except static assets and API", () => {
      expect(config.matcher).toEqual([
        "/((?!api|_next/static|_next/image|favicon.ico|texture/).*)",
      ]);
    });
  });
});
