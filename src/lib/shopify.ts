// src/lib/shopify.ts
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { getStoreConfig } from "@/lib/storeResolver";

export async function storefrontQuery<T = any>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const cfg    = getStoreConfig();
  const client = createStorefrontApiClient({
    storeDomain:       cfg.shopifyDomain,
    apiVersion:        cfg.apiVersion,
    publicAccessToken: cfg.storefrontToken,
  });
  const { data, errors } = await client.request(query, { variables });
  if (errors) throw new Error(`Shopify API Error: ${JSON.stringify(errors)}`);
  return data as T;
}

// Legacy compatibility
export async function shopifyFetch<T>(
  _store: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return storefrontQuery<T>(query, variables);
}
