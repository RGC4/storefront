// src/lib/shopify.ts
import { storefrontQuery as resolverQuery } from "@/lib/storeResolver";

/**
 * Query Shopify using the host-resolved store config.
 * The store is determined by the request hostname — not a URL segment.
 */
export async function storefrontQuery<T = any>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return resolverQuery<T>(query, variables);
}

/**
 * Legacy: kept for compatibility with any code still passing a store segment.
 * Ignores the segment and uses host-based resolution instead.
 */
export async function shopifyFetch<T>(
  _store: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return resolverQuery<T>(query, variables);
}
