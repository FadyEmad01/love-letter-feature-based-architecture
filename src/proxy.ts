import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Maintenance mode — redirect everything except /maintenance itself
  if (process.env.MAINTENANCE_MODE === "true" && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // Maintenance page is always accessible (no auth required)
  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  // Already logged in trying to access login/register → redirect to dashboard
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protected route without session → login
  if (!isAuthPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
