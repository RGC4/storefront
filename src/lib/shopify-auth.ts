// src/lib/shopify-auth.ts
const SHOP_ID = process.env.SHOPIFY_SHOP_ID!;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!;
const AUTH_BASE = `https://shopify.com/authentication/${SHOP_ID}`;

function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (const val of randomValues) {
    result += chars[val % chars.length];
  }
  return result;
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function buildLoginUrl(appUrl: string): Promise<{ url: string; state: string; codeVerifier: string }> {
  const state = generateRandomString(32);
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const nonce = generateRandomString(16);
  const callbackUrl = `${appUrl}/api/auth/callback`;

  console.log("[shopify-auth] callback URL:", callbackUrl);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: callbackUrl,
    scope: "openid email customer-account-api:full",
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const url = `${AUTH_BASE}/oauth/authorize?${params.toString()}`;
  return { url, state, codeVerifier };
}

export async function exchangeCodeForTokens(code: string, codeVerifier: string, appUrl: string) {
  const callbackUrl = `${appUrl}/api/auth/callback`;
  
  const res = await fetch(`${AUTH_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: callbackUrl,
      code,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return res.json();
}

export async function getCustomerProfile(accessToken: string) {
  const res = await fetch(
    `https://shopify.com/${SHOP_ID}/account/customer/api/2024-07/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({
        query: `{
          customer {
            id
            displayName
            emailAddress { emailAddress }
            imageUrl
          }
        }`,
      }),
    }
  );

  const { data } = await res.json();
  return data?.customer ?? null;
}
