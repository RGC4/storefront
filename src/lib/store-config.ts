import { list, head } from "@vercel/blob";
import { StoreConfig, defaultStoreConfig } from "@/types/store";
import { cache } from "react";

// Domain → Store ID mapping
// Add new stores here as you onboard them
const DOMAIN_MAP: Record<string, string> = {
  "www.prestigeapparelgroup.com": "s1",
  "prestigeapparelgroup.com": "s1",
  "localhost:3000": "s1",
  // Add more domains here:
  // "www.store2.com": "s2",
};

export function getStoreIdFromDomain(domain: string): string {
  return DOMAIN_MAP[domain] ?? "s1";
}

// Fetch store config from Vercel Blob
// Falls back to default config if not found
export const getStoreConfig = cache(async (storeId: string): Promise<StoreConfig> => {
  try {
    const url = `${process.env.BLOB_BASE_URL}/stores/${storeId}.json`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) throw new Error("Config not found");
    const config = await res.json();
    return { ...defaultStoreConfig, ...config };
  } catch {
    // Fall back to default config
    console.warn(`No blob config found for store ${storeId}, using defaults`);
    return { ...defaultStoreConfig, storeId };
  }
});
