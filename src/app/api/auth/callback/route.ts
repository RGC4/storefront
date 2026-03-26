// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { exchangeCodeForTokens, getCustomerProfile } from "@/lib/shopify-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookies = request.headers.get("cookie") || "";
  const cookieMap = Object.fromEntries(
    cookies.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, decodeURIComponent(val.join("="))];
    })
  );

  const savedState = cookieMap["shopify_auth_state"];
  const codeVerifier = cookieMap["shopify_code_verifier"];
  const callbackUrl = cookieMap["shopify_callback_url"] || "/";
  const appUrl = cookieMap["shopify_app_url"] || process.env.SHOPIFY_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(new URL("/login?error=shopify_error", appUrl));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_params", appUrl));
  }

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(new URL("/login?error=state_mismatch", appUrl));
  }

  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/login?error=missing_verifier", appUrl));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, codeVerifier, appUrl);
    const customer = await getCustomerProfile(tokens.access_token);

    const session = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
      customer: {
        id: customer?.id,
        name: customer?.displayName,
        email: customer?.emailAddress?.emailAddress,
        image: customer?.imageUrl,
      },
    };

    const redirectTo = callbackUrl.startsWith("/") ? new URL(callbackUrl, appUrl) : new URL("/", appUrl);
    const response = NextResponse.redirect(redirectTo);

    response.cookies.set("shopify_session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expires_in,
      path: "/",
    });

    response.cookies.delete("shopify_auth_state");
    response.cookies.delete("shopify_code_verifier");
    response.cookies.delete("shopify_callback_url");
    response.cookies.delete("shopify_app_url");

    return response;
  } catch (err) {
    console.error("[auth/callback] error:", err);
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", appUrl));
  }
}
