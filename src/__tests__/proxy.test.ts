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

describe("proxy middleware", () => {
  afterEach(() => {
    vi.clearAllMocks();
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

  describe("config", () => {
    it("targets /dashboard routes", () => {
      expect(config.matcher).toEqual(["/dashboard/:path*"]);
    });
  });
});
