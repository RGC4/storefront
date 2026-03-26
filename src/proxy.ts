// src/proxy.ts
// Next.js 16 uses proxy.ts instead of middleware.ts
// Must export a function named "proxy" or use default export

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require a logged-in session
const PROTECTED = [
  /^\/orders(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/address(\/.*)?$/,
  /^\/wish-list(\/.*)?$/,
  /^\/payment-methods(\/.*)?$/,
  /^\/support-tickets(\/.*)?$/,
  /^\/(customer-dashboard)(\/.*)?$/,
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie
  const session = request.cookies.get("shopify_session");

  // Redirect guests away from protected routes
  if (!session && PROTECTED.some((r) => r.test(pathname))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login page
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|assets|api/auth).*)",
  ],
};
