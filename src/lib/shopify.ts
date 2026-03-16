// src/lib/shopify.ts
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { getStoreConfigFromUrlSegment } from "@/lib/storeConfig";

function getClient(store: string) {
  const cfg = getStoreConfigFromUrlSegment(store);
  return createStorefrontApiClient({
    storeDomain: cfg.shopifyDomain,
    apiVersion: cfg.apiVersion,
    publicAccessToken: cfg.storefrontToken,
  });
}

/**
 * Fetches from the Shopify store selected by URL segment.
 */
export async function shopifyFetch<T>(
  store: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const client = getClient(store);
  const { data, errors } = await client.request(query, { variables });

  if (errors) throw new Error(`Shopify API Error: ${JSON.stringify(errors)}`);
  return data as T;
}
