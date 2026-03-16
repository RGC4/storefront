<<<<<<< HEAD
// src/lib/storeConfig.ts
=======
﻿// src/lib/storeConfig.ts
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
export type StoreConfig = {
  store: string;                 // URL segment, e.g. "s2"
  storeName: string;             // display name
  shopifyDomain: string;         // e.g. "xxxx.myshopify.com"
  storefrontToken: string;       // Storefront API token
  apiVersion: string;            // Shopify Storefront API version
};

/**
 * "s2" -> "S2"
 * "s10" -> "S10"
 */
function envPrefixFromStore(store: string): string {
  return store.toUpperCase();
}

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

/**
 * Store is selected by URL segment (NOT host).
 *
 * For URL /s2/... you must define:
 *   S2_SHOPIFY_DOMAIN
 *   S2_STOREFRONT_TOKEN
 *
 * For URL /s3/...:
 *   S3_SHOPIFY_DOMAIN
 *   S3_STOREFRONT_TOKEN
 *
 * ...
 */
export function getStoreConfigFromUrlSegment(store: string): StoreConfig {
  const prefix = envPrefixFromStore(store);

  const shopifyDomain = mustGetEnv(`${prefix}_SHOPIFY_DOMAIN`);
  const storefrontToken = mustGetEnv(`${prefix}_STOREFRONT_TOKEN`);

  return {
    store,
    storeName: store,
    shopifyDomain,
    storefrontToken,
    apiVersion: process.env.SHOPIFY_API_VERSION ?? "2026-01",
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
