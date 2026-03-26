// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { buildLoginUrl } from "@/lib/shopify-auth";

export async function GET(request: Request) {
  try {
    const appUrl = process.env.SHOPIFY_APP_URL || "http://localhost:3000";
    console.log("[auth/login] appUrl:", appUrl);
    const { url, state, codeVerifier } = await buildLoginUrl(appUrl);
    const callbackUrl = new URL(request.url).searchParams.get("callbackUrl") || "/";
    const response = NextResponse.redirect(url);
    response.cookies.set("shopify_auth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
    response.cookies.set("shopify_code_verifier", codeVerifier, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
    response.cookies.set("shopify_callback_url", callbackUrl, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
    response.cookies.set("shopify_app_url", appUrl, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
    return response;
  } catch (error) {
    console.error("[auth/login]", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }
}
