// src/app/sitemap.ts
// REPLACES your current static 3-URL sitemap with a dynamic one
// that pulls ALL products and collections from Shopify

import { MetadataRoute } from "next";
import { storefrontQuery } from "lib/shopify";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com";
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

async function getAllProducts() {
  const products: { handle: string; updatedAt: string }[] = [];
  let cursor: string | null = null;

  do {
    const data: any = await storefrontQuery(
      `query Products($first: Int!, $after: String, $query: String) {
        products(first: 250, after: $after, query: $query) {
          pageInfo { hasNextPage endCursor }
          edges {
            node {
              handle
              updatedAt
            }
          }
        }
      }`,
      { first: 250, after: cursor, query: `tag:${STORE_ID}` }
    ).catch(() => null);

    if (!data?.products?.edges) break;

    for (const { node } of data.products.edges) {
      products.push({ handle: node.handle, updatedAt: node.updatedAt });
    }

    cursor = data.products.pageInfo.hasNextPage
      ? data.products.pageInfo.endCursor
      : null;
  } while (cursor);

  return products;
}

async function getAllCollections() {
  const data: any = await storefrontQuery(
    `query Collections {
      collections(first: 250) {
        edges {
          node {
            handle
            updatedAt
          }
        }
      }
    }`
  ).catch(() => null);

  if (!data?.collections?.edges) return [];
  return data.collections.edges.map(({ node }: any) => ({
    handle: node.handle,
    updatedAt: node.updatedAt,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/shipping-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic product pages
  const products = await getAllProducts();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.handle}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic collection pages
  const collections = await getAllCollections();
  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${BASE_URL}/collections/${c.handle}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...collectionPages, ...productPages];
}
