import { NextRequest, NextResponse } from "next/server";

/**
 * Routes that are always accessible without a user token.
 * Pattern-based matching: exact paths or startsWith prefixes.
 */
const PUBLIC_PATHS = ["/", "/login", "/register", "/all-products", "/product"];

/**
 * Routes that require the user to be logged in.
 * Any pathname that starts with one of these values is protected.
 */
const PROTECTED_PREFIXES = ["/checkout", "/profile", "/wishlist", "/cart"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/"))
  );
}

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("user_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Authenticated users should not see auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected routes require a valid user token
  if (isProtected(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If a non-customer role sneaks in (e.g. superAdmin), clear their cookies
  // and redirect to login so they don't see the storefront as authenticated.
  if (token && userRole && userRole === "superAdmin" && isProtected(pathname)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("user_token");
    response.cookies.delete("user_role");
    response.cookies.delete("user_id");
    response.cookies.delete("user_email");
    response.cookies.delete("user_fullname");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico
     * - Static file extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
