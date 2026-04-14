// src/app/api/webhooks/products-update/route.ts
//
// Shopify products/update webhook
// When BrandsGateway overwrites tags, this fires instantly and merges
// the store tags (s1, s2 etc.) back in based on custom.store_number metafield.
//
// Register this URL once in Shopify Admin:
//   Settings → Notifications → Webhooks → Create webhook
//   Event:   Product updated
//   URL:     https://www.imperialaccessories.com/api/webhooks/products-update
//   Format:  JSON
//

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const DOMAIN         = process.env.SHOPIFY_STORE_DOMAIN
                    || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const ADMIN_TOKEN    = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET     || "";
const API_VERSION    = process.env.SHOPIFY_API_VERSION        || "2026-01";

// ── HMAC verification ─────────────────────────────────────────────────────
function verifyWebhook(body: string, hmacHeader: string): boolean {
  if (!WEBHOOK_SECRET) return true; // skip verification in dev if secret not set
  const hash = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
}

// ── Read custom.store_number metafield via Admin API ─────────────────────────
async function getStoreIdsMetafield(productId: number): Promise<string[]> {
  const query = `
    query GetMetafield($id: ID!) {
      product(id: $id) {
        metafield(namespace: "custom", key: "store_number") {
          value
        }
      }
    }
  `;

  const res = await fetch(
    `https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type":           "application/json",
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { id: `gid://shopify/Product/${productId}` },
      }),
    }
  );

  const json = await res.json();
  const value = json?.data?.product?.metafield?.value || "";

  if (!value) return [];

  // Parse comma-separated store IDs e.g. "s1,s2" → ["s1", "s2"]
  return value.split(",").map((s: string) => s.trim()).filter(Boolean);
}

// ── Merge store tags back into existing tags ──────────────────────────────
function mergeTags(existingTags: string[], storeIds: string[]): string {
  const tagSet = new Set(existingTags.map(t => t.trim()).filter(Boolean));

  // Add each store ID back as a tag
  for (const storeId of storeIds) {
    tagSet.add(storeId); // e.g. "s1", "s2"
  }

  return Array.from(tagSet).join(", ");
}

// ── Update product tags via Admin REST API ────────────────────────────────
async function updateProductTags(
  productId: number,
  mergedTags: string
): Promise<void> {
  const res = await fetch(
    `https://${DOMAIN}/admin/api/${API_VERSION}/products/${productId}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type":           "application/json",
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({
        product: {
          id:   productId,
          tags: mergedTags,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update tags: ${err}`);
  }
}

// ── Webhook handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const hmac    = req.headers.get("x-shopify-hmac-sha256") || "";

    // 1. Verify request is genuinely from Shopify
    if (!verifyWebhook(rawBody, hmac)) {
      console.warn("[webhook] HMAC verification failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse product payload from BrandsGateway update
    const product   = JSON.parse(rawBody);
    const productId = product.id as number;

    // Tags BrandsGateway just set (comma-separated string in REST payload)
    const currentTags: string[] = (product.tags || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    // 3. Read which stores this product belongs to from metafield
    const storeIds = await getStoreIdsMetafield(productId);

    if (storeIds.length === 0) {
      // No store_number metafield set — nothing to restore
      console.log(`[webhook] Product ${productId} has no store_number metafield — skipping`);
      return NextResponse.json({ ok: true, skipped: true });
    }

    // 4. Check if store tags already present — avoid unnecessary update
    const alreadyPresent = storeIds.every(id => currentTags.includes(id));
    if (alreadyPresent) {
      console.log(`[webhook] Product ${productId} already has store tags — skipping`);
      return NextResponse.json({ ok: true, skipped: true });
    }

    // 5. Merge store tags back into BrandsGateway tags
    const mergedTags = mergeTags(currentTags, storeIds);
    await updateProductTags(productId, mergedTags);

    console.log(`[webhook] Product ${productId} → tags restored: ${storeIds.join(", ")}`);

    // 6. Return 200 so Shopify does not retry
    return NextResponse.json({ ok: true, storeIds, mergedTags });

  } catch (err) {
    console.error("[webhook] Error:", err);
    // Return 200 even on error to prevent Shopify retry storm
    return NextResponse.json({ ok: true, error: "logged" }, { status: 200 });
  }
}
