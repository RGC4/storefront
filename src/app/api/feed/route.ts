// src/app/api/feed/route.ts
//
// Pinterest / Google Shopping XML product feed
// Filters products by custom.store_ids metafield matching NEXT_PUBLIC_STORE_ID
// Works across all stores with zero code changes — only the env var differs per Vercel project
//
// Feed URL:  https://your-store.com/api/feed
// Pinterest: add this URL as a Custom data source in Pinterest Catalogs

import { NextResponse } from "next/server";

const STORE_ID    = process.env.NEXT_PUBLIC_STORE_ID    || "s1";
const STORE_NAME  = process.env.NEXT_PUBLIC_STORE_NAME  || "My Store";
const STORE_URL   = process.env.NEXT_PUBLIC_STORE_URL   || "";

// Reuse your existing Shopify credentials pattern
const DOMAIN  = process.env.SHOPIFY_STORE_DOMAIN        || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const TOKEN   = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const VERSION = process.env.SHOPIFY_API_VERSION         || "2026-01";

const PAGE_SIZE = 250; // max per Shopify page

// ── GraphQL query ────────────────────────────────────────────────────────────
const PRODUCTS_QUERY = `
  query GetProducts($cursor: String) {
    products(first: ${PAGE_SIZE}, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          vendor
          productType
          availableForSale
          metafield(namespace: "custom", key: "store_ids") { value }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url altText } }
          }
          variants(first: 1) {
            edges {
              node {
                id
                sku
                availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

// ── Shopify fetch ────────────────────────────────────────────────────────────
async function fetchPage(cursor: string | null) {
  const res = await fetch(
    `https://${DOMAIN}/api/${VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { cursor },
      }),
      next: { revalidate: 3600 }, // cache 1 hour
    }
  );
  const json = await res.json();
  return json?.data?.products;
}

// ── Fetch ALL products for this store ────────────────────────────────────────
async function fetchStoreProducts() {
  const results: any[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const page = await fetchPage(cursor);
    if (!page) break;

    for (const edge of page.edges) {
      const node = edge.node;
      // Exact match on store_ids metafield (comma-separated e.g. "s1,s5")
      const storeIds = (node.metafield?.value || "")
        .split(",")
        .map((s: string) => s.trim());

      if (storeIds.includes(STORE_ID)) {
        results.push(node);
      }
    }

    hasNextPage = page.pageInfo.hasNextPage;
    cursor = page.pageInfo.endCursor;
  }

  return results;
}

// ── XML helpers ──────────────────────────────────────────────────────────────
function esc(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// ── Build RSS/Atom feed (Google Shopping / Pinterest format) ─────────────────
function buildFeed(products: any[]): string {
  const baseUrl = STORE_URL.replace(/\/$/, "");

  const items = products.map((p) => {
    const variant   = p.variants?.edges?.[0]?.node;
    const image     = p.images?.edges?.[0]?.node;
    const price     = variant?.price?.amount     || p.priceRange?.minVariantPrice?.amount || "0";
    const currency  = variant?.price?.currencyCode || p.priceRange?.minVariantPrice?.currencyCode || "USD";
    const compareAt = variant?.compareAtPrice?.amount;
    const sku       = variant?.sku || p.handle;
    const available = p.availableForSale ? "in stock" : "out of stock";
    const link      = `${baseUrl}/products/${p.handle}`;
    const desc      = esc(stripHtml(p.descriptionHtml) || p.title);

    return `
    <item>
      <g:id>${esc(p.handle)}</g:id>
      <g:title>${esc(p.title)}</g:title>
      <g:description>${desc}</g:description>
      <g:link>${esc(link)}</g:link>
      ${image ? `<g:image_link>${esc(image.url)}</g:image_link>` : ""}
      <g:price>${parseFloat(price).toFixed(2)} ${currency}</g:price>
      ${compareAt ? `<g:sale_price>${parseFloat(compareAt).toFixed(2)} ${currency}</g:sale_price>` : ""}
      <g:availability>${available}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${esc(p.vendor || STORE_NAME)}</g:brand>
      ${sku ? `<g:mpn>${esc(sku)}</g:mpn>` : ""}
      ${p.productType ? `<g:product_type>${esc(p.productType)}</g:product_type>` : ""}
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(STORE_NAME)}</title>
    <link>${esc(baseUrl)}</link>
    <description>${esc(STORE_NAME)} product feed</description>
${items}
  </channel>
</rss>`;
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function GET() {
  try {
    if (!DOMAIN || !TOKEN) {
      return new NextResponse("Shopify credentials not configured", { status: 500 });
    }

    const products = await fetchStoreProducts();

    if (products.length === 0) {
      return new NextResponse("No products found for this store", { status: 404 });
    }

    const xml = buildFeed(products);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("[feed] Error generating feed:", err);
    return new NextResponse("Feed generation failed", { status: 500 });
  }
}
