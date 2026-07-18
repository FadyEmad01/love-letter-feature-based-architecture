import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Maintenance mode ON → only /maintenance is accessible
  if (process.env.MAINTENANCE_MODE === "true") {
    return pathname === "/maintenance"
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // 2. Maintenance mode OFF → /maintenance redirects home
  if (pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Public routes → always accessible (no auth needed)
  if (
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register"
  ) {
    const sessionCookie = getSessionCookie(request);

    // Logged-in user on auth pages → dashboard
    if (sessionCookie && pathname !== "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 4. Protected routes → require session
  const sessionCookie = getSessionCookie(request);
  return sessionCookie
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|texture/|gif/|svg/).*)",
  ],
};
