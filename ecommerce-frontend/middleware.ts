import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("user_token")?.value;
  const { pathname } = request.nextUrl;

  // Logged-in user should not access login/register
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected routes — must be logged in
  if (!token && pathname.startsWith("/settings")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/settings/:path*"],
};