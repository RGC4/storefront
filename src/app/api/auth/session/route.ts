// src/app/api/auth/session/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Returns the current session for client components.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookies = request.headers.get("cookie") || "";
  const cookieMap = Object.fromEntries(
    cookies.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")];
    })
  );

  const sessionCookie = cookieMap["shopify_session"];

  if (!sessionCookie) {
    return NextResponse.json({ user: null });
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));

    // Check if session is expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: session.customer });
  } catch {
    return NextResponse.json({ user: null });
  }
}
