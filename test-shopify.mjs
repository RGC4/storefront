import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
const envVars = {};
try {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    envVars[key] = val;
  }
  console.log("✅ .env.local loaded from:", envPath);
} catch (e) {
  console.error("❌ Could not read .env.local:", e.message);
  process.exit(1);
}

const domain = envVars.SHOPIFY_STORE_DOMAIN;
const token = envVars.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = envVars.SHOPIFY_API_VERSION || "2026-01";

console.log("\n--- Env Var Check ---");
console.log("SHOPIFY_STORE_DOMAIN:              ", domain || "MISSING");
console.log("SHOPIFY_STOREFRONT_ACCESS_TOKEN:   ", token ? token.slice(0, 6) + "..." : "MISSING");
console.log("SHOPIFY_API_VERSION:               ", version);

if (!domain || !token) {
  console.error("\n❌ Missing required env vars. Check your .env.local file.");
  process.exit(1);
}

const url = "https://" + domain + "/api/" + version + "/graphql.json";
console.log("\n--- Attempting connection to ---");
console.log(url);

const query = "{ shop { name primaryDomain { url } } }";

try {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query }),
  });

  console.log("\nHTTP Status:", res.status, res.statusText);
  const json = await res.json();

  if (json.errors) {
    console.error("❌ Shopify API errors:", JSON.stringify(json.errors, null, 2));
    process.exit(1);
  }

  if (json.data?.shop) {
    console.log("\n✅ Connected to:", json.data.shop.name);
    console.log("   Domain:     ", json.data.shop.primaryDomain.url);
  } else {
    console.error("❌ Unexpected response:", JSON.stringify(json, null, 2));
  }
} catch (e) {
  console.error("❌ Fetch failed:", e.message);
}
