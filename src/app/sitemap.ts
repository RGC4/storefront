// src/app/sitemap.ts

export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { storefrontQuery } from "lib/shopify";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com";
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

async function getAllProducts() {
  const products: string[] = [];
  let cursor: string | null = null;

  do {
    const data: any = await storefrontQuery(
      `query SitemapProducts($n: Int!, $q: String, $after: String) {
        products(first: $n, after: $after, query: $q) {
          pageInfo { hasNextPage endCursor }
          edges {
            node {
              handle
            }
          }
        }
      }`,
      { n: 250, q: `tag:${STORE_ID}`, after: cursor }
    ).catch(() => null);

    if (!data?.products?.edges) break;

    for (const { node } of data.products.edges) {
      products.push(node.handle);
    }

    cursor = data.products.pageInfo.hasNextPage
      ? data.products.pageInfo.endCursor
      : null;
  } while (cursor);

  return products;
}

async function getAllCollections() {
  const data: any = await storefrontQuery(
    `query SitemapCollections {
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
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/collections`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const products = await getAllProducts();
  const productPages: MetadataRoute.Sitemap = products.map((handle) => ({
    url: `${BASE_URL}/products/${handle}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const collections = await getAllCollections();
  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${BASE_URL}/collections/${c.handle}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  console.log(`Sitemap: ${staticPages.length} static, ${collectionPages.length} collections, ${productPages.length} products`);

  return [...staticPages, ...collectionPages, ...productPages];
}
