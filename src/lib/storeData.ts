// src/lib/storeData.ts
// ============================================================
// STORE DATA LAYER
// All store config reads/writes go through this file.
// Uses Vercel Blob for storage with in-memory caching.
// ============================================================

import { put, head, list } from "@vercel/blob";
import type { StoreConfig } from "./storeSchema";

// In-memory cache to avoid hitting blob on every request
const cache = new Map<string, { config: StoreConfig; fetchedAt: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

function blobKey(storeId: string): string {
  return `stores/${storeId}/config.json`;
}

// ── READ ──────────────────────────────────────────────────────

export async function getStoreConfig(storeId: string): Promise<StoreConfig | null> {
  // Check in-memory cache first
  const cached = cache.get(storeId);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.config;
  }

  try {
    const key = blobKey(storeId);

    // Check if blob exists
    const blob = await head(key).catch(() => null);
    if (!blob) return null;

    // Fetch the config JSON
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;

    const config: StoreConfig = await res.json();

    // Store in cache
    cache.set(storeId, { config, fetchedAt: Date.now() });

    return config;
  } catch (err) {
    console.error(`[storeData] Failed to fetch config for store: ${storeId}`, err);
    return null;
  }
}

// ── WRITE ─────────────────────────────────────────────────────

export async function saveStoreConfig(config: StoreConfig): Promise<void> {
  const key = blobKey(config.storeId);

  await put(key, JSON.stringify(config, null, 2), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
  });

  // Invalidate cache
  cache.delete(config.storeId);
}

// ── LIST ALL STORES ───────────────────────────────────────────

export async function listAllStores(): Promise<StoreConfig[]> {
  try {
    const { blobs } = await list({ prefix: "stores/" });

    const configs = await Promise.all(
      blobs
        .filter((b) => b.pathname.endsWith("/config.json"))
        .map(async (b) => {
          const res = await fetch(b.url, { cache: "no-store" });
          if (!res.ok) return null;
          return res.json() as Promise<StoreConfig>;
        })
    );

    return configs.filter(Boolean) as StoreConfig[];
  } catch (err) {
    console.error("[storeData] Failed to list stores", err);
    return [];
  }
}

// ── DELETE ────────────────────────────────────────────────────

export async function deleteStoreConfig(storeId: string): Promise<void> {
  const { del } = await import("@vercel/blob");
  const key = blobKey(storeId);
  await del(key);
  cache.delete(storeId);
}

// ── CACHE INVALIDATION ────────────────────────────────────────

export function invalidateStoreCache(storeId: string): void {
  cache.delete(storeId);
}
