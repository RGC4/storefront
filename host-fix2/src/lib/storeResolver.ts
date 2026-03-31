// src/lib/storeResolver.ts
// Each Vercel project has NEXT_PUBLIC_STORE_ID and NEXT_PUBLIC_STORE_NAME set.
// Those ARE the resolver — no fs, no headers(), no host lookup needed.
// The Store Manager sets these env vars when creating each Vercel project.

export type StoreConfig = {
  storeId:         string;
  storeName:       string;
  shopifyDomain:   string;
  storefrontToken: string;
  apiVersion:      string;
};

function getShopifyCredentials(storeId: string) {
  const prefix         = storeId.toUpperCase();
  const perStoreDomain = process.env[`${prefix}_SHOPIFY_DOMAIN`];
  const perStoreToken  = process.env[`${prefix}_STOREFRONT_TOKEN`];
  if (perStoreDomain && perStoreToken) {
    return { shopifyDomain: perStoreDomain, storefrontToken: perStoreToken };
  }
  return {
    shopifyDomain:   process.env.SHOPIFY_STORE_DOMAIN || "",
    storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
  };
}

// Synchronous — safe for server and client contexts, no fs or headers needed
export function getStoreConfig(): StoreConfig {
  const storeId   = process.env.NEXT_PUBLIC_STORE_ID   || "s1";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
  const { shopifyDomain, storefrontToken } = getShopifyCredentials(storeId);
  return {
    storeId,
    storeName,
    shopifyDomain,
    storefrontToken,
    apiVersion: process.env.SHOPIFY_API_VERSION ?? "2026-01",
  };
}

// Metadata helper — synchronous, works in generateMetadata()
export function storeMetadata(pageTitle: string, description?: string) {
  const { storeName } = getStoreConfig();
  return {
    title:       `${pageTitle} \u2014 ${storeName}`,
    description: description || `${pageTitle} at ${storeName}.`,
    authors:     [{ name: storeName }],
  };
}
