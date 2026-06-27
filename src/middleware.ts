import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const FIREBASE_SESSION_COOKIE = "nexus_firebase_session";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(FIREBASE_SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  // Protect Admin, Dashboard, and Checkout routes
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checkout")
  ) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/checkout/:path*"],
};
