import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/lib/auth";

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

  // 3. Quick cookie presence check (zero DB cost — just header parsing)
  const hasCookie = !!getSessionCookie(request);

  // 4. Public routes — add new public pages here; everything else requires auth
  if (
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register"
  ) {
    // Logged-in user on auth pages → validate session + redirect to dashboard
    if (hasCookie && pathname !== "/") {
      let session = null;
      try {
        session = await auth.api.getSession({
          headers: request.headers,
        });
      } catch {
        // DB failure → treat as unauthenticated (fail closed)
      }
      if (session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // 5. Protected routes → require valid session
  // Fast path: no cookie → redirect immediately (zero DB cost)
  if (!hasCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Cookie present → validate against DB (served from cookie cache when fresh)
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    // DB failure → treat as unauthenticated (fail closed)
  }
  return session
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|texture/|gif/|svg/).*)",
  ],
};
