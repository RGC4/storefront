// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = process.env.SHOPIFY_APP_URL || process.env.NEXT_PUBLIC_NGROK_URL || "http://localhost:3000";
  const response = NextResponse.redirect(new URL("/", appUrl));

  response.cookies.delete("shopify_session");

  return response;
}
