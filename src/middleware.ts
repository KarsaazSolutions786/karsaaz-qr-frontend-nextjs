import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protect dashboard and account routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/account")) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Handle legacy root redirect if needed
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};