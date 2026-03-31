// src/lib/storeResolver.ts
// Resolves the active store from the request HOST.
// Store configs live in public/assets/stores/{id}/config.json
// To add a new store: Store Manager writes the config.json with a "domains" array.
// No code changes needed ever.

import { headers } from "next/headers";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import fs from "fs";
import path from "path";

export type StoreConfig = {
  storeId:         string;
  storeName:       string;
  shopifyDomain:   string;
  storefrontToken: string;
  apiVersion:      string;
};

type StoreJson = {
  storeId:   string;
  storeName: string;
  domains:   string[];
};

// Load all config.json files from public/assets/stores/
function loadAllStoreConfigs(): StoreJson[] {
  try {
    const storesDir = path.join(process.cwd(), "public", "assets", "stores");
    const entries   = fs.readdirSync(storesDir, { withFileTypes: true });
    const configs: StoreJson[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const cfgPath = path.join(storesDir, entry.name, "config.json");
      if (!fs.existsSync(cfgPath)) continue;
      try {
        const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
        if (cfg.storeId && cfg.storeName && Array.isArray(cfg.domains)) {
          configs.push(cfg);
        }
      } catch { /* skip malformed */ }
    }
    return configs;
  } catch { return []; }
}

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function getShopifyCredentials(storeId: string) {
  const prefix         = storeId.toUpperCase();
  const perStoreDomain = process.env[`${prefix}_SHOPIFY_DOMAIN`];
  const perStoreToken  = process.env[`${prefix}_STOREFRONT_TOKEN`];
  if (perStoreDomain && perStoreToken) {
    return { shopifyDomain: perStoreDomain, storefrontToken: perStoreToken };
  }
  return {
    shopifyDomain:   mustGetEnv("SHOPIFY_STORE_DOMAIN"),
    storefrontToken: mustGetEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN"),
  };
}

export async function getStoreConfig(): Promise<StoreConfig> {
  const h       = await headers();
  const rawHost = (h.get("host") || "localhost").toLowerCase();
  const host    = rawHost.split(":")[0];

  // Build domain map from all config.json files on each request
  const configs   = loadAllStoreConfigs();
  const domainMap: Record<string, string> = {};
  const nameMap:   Record<string, string> = {};

  for (const cfg of configs) {
    nameMap[cfg.storeId] = cfg.storeName;
    for (const domain of cfg.domains) {
      domainMap[domain.toLowerCase()] = cfg.storeId;
    }
  }

  // Fallback: localhost goes to first store
  if (!domainMap["localhost"] && configs.length > 0) {
    domainMap["localhost"] = configs[0].storeId;
  }

  const storeId =
    domainMap[rawHost] ||
    domainMap[host]    ||
    process.env.NEXT_PUBLIC_STORE_ID ||
    "s1";

  const { shopifyDomain, storefrontToken } = getShopifyCredentials(storeId);

  return {
    storeId,
    storeName:      nameMap[storeId] || process.env.NEXT_PUBLIC_STORE_NAME || storeId,
    shopifyDomain,
    storefrontToken,
    apiVersion:     process.env.SHOPIFY_API_VERSION ?? "2026-01",
  };
}

export function createShopifyClient(cfg: StoreConfig) {
  return createStorefrontApiClient({
    storeDomain:       cfg.shopifyDomain,
    apiVersion:        cfg.apiVersion,
    publicAccessToken: cfg.storefrontToken,
  });
}

export async function storefrontQuery<T = any>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const cfg    = await getStoreConfig();
  const client = createShopifyClient(cfg);
  const { data, errors } = await client.request(query, { variables });
  if (errors) throw new Error(`Shopify API Error: ${JSON.stringify(errors)}`);
  return data as T;
}

export async function storeMetadata(pageTitle: string, description?: string) {
  const { storeName } = await getStoreConfig();
  return {
    title:       `${pageTitle} \u2014 ${storeName}`,
    description: description || `${pageTitle} at ${storeName}.`,
    authors:     [{ name: storeName }],
  };
}
