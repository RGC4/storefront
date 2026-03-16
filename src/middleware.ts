import { NextRequest, NextResponse } from "next/server";
import { getStoreIdFromDomain } from "@/lib/store-config";

export function middleware(req: NextRequest) {
  const domain = req.headers.get("host") || "localhost:3000";
  const storeId = getStoreIdFromDomain(domain);

  // Clone the request headers and inject store ID
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-store-id", storeId);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|pictures|api).*)",
  ],
};
