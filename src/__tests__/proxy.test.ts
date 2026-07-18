import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { config, proxy } from "../proxy";

vi.mock("better-auth/cookies", () => ({
  getSessionCookie: vi.fn(),
}));

vi.mock("@/features/auth/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/features/auth/lib/auth";

const mockGetSessionCookie = vi.mocked(getSessionCookie);
const mockGetSession = vi.mocked(auth.api.getSession);

const validSession = {
  session: { id: "session-123" },
  user: { id: "user-123", name: "Test", email: "test@test.com" },
};

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
      mockGetSession.mockResolvedValue(validSession);

      const response = await proxy(createRequest("/dashboard"));

      expect(response.status).toBe(200);
    });

    it("does not redirect other routes when MAINTENANCE_MODE is 'false'", async () => {
      process.env.MAINTENANCE_MODE = "false";
      mockGetSessionCookie.mockReturnValue("valid-session");
      mockGetSession.mockResolvedValue(validSession);

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
      mockGetSession.mockResolvedValue(validSession);

      const response = await proxy(createRequest("/auth/login"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard",
      );
    });

    it("redirects logged-in user from /auth/register to /dashboard", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session");
      mockGetSession.mockResolvedValue(validSession);

      const response = await proxy(createRequest("/auth/register"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard",
      );
    });

    it("stays on /auth/login when cookie exists but session is expired", async () => {
      mockGetSessionCookie.mockReturnValue("expired-session");
      mockGetSession.mockResolvedValue(null);

      const response = await proxy(createRequest("/auth/login"));

      expect(response.status).toBe(200);
      expect(mockGetSession).toHaveBeenCalledOnce();
    });

    it("stays on /auth/register when cookie exists but session is expired", async () => {
      mockGetSessionCookie.mockReturnValue("expired-session");
      mockGetSession.mockResolvedValue(null);

      const response = await proxy(createRequest("/auth/register"));

      expect(response.status).toBe(200);
      expect(mockGetSession).toHaveBeenCalledOnce();
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

    it("passes through when session cookie exists and session is valid", async () => {
      mockGetSessionCookie.mockReturnValue("valid-session");
      mockGetSession.mockResolvedValue(validSession);

      const response = await proxy(createRequest("/dashboard"));

      expect(response.status).toBe(200);
    });

    it("redirects to /auth/login when cookie exists but session is expired", async () => {
      mockGetSessionCookie.mockReturnValue("expired-session");
      mockGetSession.mockResolvedValue(null);

      const response = await proxy(createRequest("/dashboard"));

      expect(response.status).toBeGreaterThanOrEqual(300);
      expect(response.status).toBeLessThan(400);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/auth/login",
      );
      expect(mockGetSession).toHaveBeenCalledOnce();
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

    it("does not call getSession when no cookie is present", async () => {
      await proxy(createRequest("/dashboard"));

      expect(mockGetSession).not.toHaveBeenCalled();
    });
  });

  // ─── Config ──────────────────────────────────────────────
  describe("config", () => {
    it("targets all routes except static assets and API", () => {
      expect(config.matcher).toEqual([
        "/((?!api|_next/static|_next/image|favicon.ico|texture/|gif/|svg/).*)",
      ]);
    });
  });
});
