// scripts/upload-asset.ts
// ============================================================
// Upload store assets to Vercel Blob with hash-based change detection.
// Only uploads files that have actually changed — safe to run anytime.
//
// Usage:
//   npx tsx scripts/upload-asset.ts --store=s1 --all
//   npx tsx scripts/upload-asset.ts --store=s1 --file=hero-1.mp4
//   npx tsx scripts/upload-asset.ts --store=s1 --file=privacy_policy.html
//   npx tsx scripts/upload-asset.ts --store=s1 --type=videos
//   npx tsx scripts/upload-asset.ts --store=s1 --type=policies
//   npx tsx scripts/upload-asset.ts --all-stores --all
//
// Requires BLOB_READ_WRITE_TOKEN in your .env.local
// ============================================================

import { put, head, list } from "@vercel/blob";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, extname } from "path";
import { createHash } from "crypto";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Explicitly set token for @vercel/blob
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "";
if (!BLOB_TOKEN) {
  console.error("❌  BLOB_READ_WRITE_TOKEN not found in .env.local");
  process.exit(1);
}

// ── Asset type definitions ────────────────────────────────────────────────────

type AssetType = "videos" | "images" | "logo" | "policies";

const ASSET_TYPES: Record<AssetType, { extensions: string[]; contentType: (f: string) => string }> = {
  videos: {
    extensions: [".mp4", ".webm"],
    contentType: () => "video/mp4",
  },
  images: {
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
    contentType: (f) => f.endsWith(".png") ? "image/png" : f.endsWith(".webp") ? "image/webp" : "image/jpeg",
  },
  logo: {
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".svg", ".JPG"],
    contentType: (f) => f.endsWith(".png") ? "image/png" : f.endsWith(".svg") ? "image/svg+xml" : f.endsWith(".webp") ? "image/webp" : "image/jpeg",
  },
  policies: {
    extensions: [".html"],
    contentType: () => "text/html; charset=utf-8",
  },
};

// ── Blob key helpers ──────────────────────────────────────────────────────────

function assetBlobKey(storeId: string, type: AssetType, filename: string): string {
  return `stores/${storeId}/${type}/${filename}`;
}

function hashBlobKey(storeId: string, type: AssetType, filename: string): string {
  return `stores/${storeId}/.hashes/${type}/${filename}.md5`;
}

// ── Local path helpers ────────────────────────────────────────────────────────

function localAssetPath(storeId: string, type: AssetType, filename: string): string {
  return join(process.cwd(), "public", "assets", "stores", storeId, type, filename);
}

function localAssetDir(storeId: string, type: AssetType): string {
  return join(process.cwd(), "public", "assets", "stores", storeId, type);
}

// ── Hash helpers ──────────────────────────────────────────────────────────────

function md5File(filePath: string): string {
  const buf = readFileSync(filePath);
  return createHash("md5").update(buf).digest("hex");
}

async function getStoredHash(storeId: string, type: AssetType, filename: string): Promise<string | null> {
  try {
    const key = hashBlobKey(storeId, type, filename);
    const blob = await head(key, { token: BLOB_TOKEN }).catch(() => null);
    if (!blob) return null;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.text()).trim();
  } catch {
    return null;
  }
}

async function storeHash(storeId: string, type: AssetType, filename: string, hash: string): Promise<void> {
  const key = hashBlobKey(storeId, type, filename);
  await put(key, hash, { token: BLOB_TOKEN,
    access: "private",
    contentType: "text/plain",
    allowOverwrite: true,
  });
}

// ── Upload a single file ──────────────────────────────────────────────────────

async function uploadFile(
  storeId: string,
  type: AssetType,
  filename: string,
  force = false
): Promise<"uploaded" | "skipped" | "missing"> {
  const localPath = localAssetPath(storeId, type, filename);

  if (!existsSync(localPath)) {
    return "missing";
  }

  const localHash = md5File(localPath);
  const storedHash = force ? null : await getStoredHash(storeId, type, filename);

  if (!force && storedHash === localHash) {
    return "skipped";
  }

  const fileBuffer = readFileSync(localPath);
  const blobKey = assetBlobKey(storeId, type, filename);
  const { contentType } = ASSET_TYPES[type];

  await put(blobKey, fileBuffer, { token: BLOB_TOKEN,
    access: "private",
    contentType: contentType(filename),
    contentDisposition: "inline",
    allowOverwrite: true,
  });

  // Store the hash so next run can skip if unchanged
  await storeHash(storeId, type, filename, localHash);

  return "uploaded";
}

// ── Upload all files of a type for a store ────────────────────────────────────

async function uploadType(storeId: string, type: AssetType, force = false): Promise<void> {
  const dir = localAssetDir(storeId, type);

  if (!existsSync(dir)) {
    console.log(`  [${type}] No local directory found at ${dir}, skipping`);
    return;
  }

  const { extensions } = ASSET_TYPES[type];
  const files = readdirSync(dir).filter((f) =>
    extensions.includes(extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log(`  [${type}] No files found`);
    return;
  }

  for (const filename of files) {
    const result = await uploadFile(storeId, type, filename, force);
    const icon = result === "uploaded" ? "↑" : result === "skipped" ? "✓" : "✗";
    const label = result === "uploaded" ? "uploaded" : result === "skipped" ? "unchanged, skipping" : "not found locally";
    console.log(`  ${icon}  ${type}/${filename}  — ${label}`);
  }
}

// ── Upload all asset types for a store ───────────────────────────────────────

async function uploadStore(storeId: string, force = false): Promise<void> {
  console.log(`\n▶  Store: ${storeId}`);
  for (const type of Object.keys(ASSET_TYPES) as AssetType[]) {
    await uploadType(storeId, type, force);
  }
}

// ── Discover all store IDs from local folder structure ────────────────────────

function discoverStores(): string[] {
  const storesDir = join(process.cwd(), "public", "assets", "stores");
  if (!existsSync(storesDir)) return [];
  return readdirSync(storesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

// ── Resolve which asset type a filename belongs to ───────────────────────────

function resolveTypeFromFilename(filename: string): AssetType | null {
  const ext = extname(filename).toLowerCase();
  for (const [type, { extensions }] of Object.entries(ASSET_TYPES) as [AssetType, typeof ASSET_TYPES[AssetType]][]) {
    if (extensions.includes(ext)) return type;
  }
  return null;
}

// ── List what's in Blob for a store ──────────────────────────────────────────

async function listStoreAssets(storeId: string): Promise<void> {
  console.log(`\n▶  Blob assets for store: ${storeId}`);
  const { blobs } = await list({ prefix: `stores/${storeId}/`, token: BLOB_TOKEN });
  const assets = blobs.filter((b) => !b.pathname.includes("/.hashes/") && !b.pathname.endsWith("config.json"));
  if (assets.length === 0) {
    console.log("  (none found)");
    return;
  }
  for (const b of assets) {
    const kb = (b.size / 1024).toFixed(1);
    console.log(`  ${b.pathname}  (${kb} KB)`);
  }
}

// ── CLI entry point ───────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const match = args.find((a) => a.startsWith(`--${flag}=`));
    return match ? match.split("=")[1] : null;
  };
  const has = (flag: string) => args.includes(`--${flag}`);

  const storeArg    = get("store");
  const fileArg     = get("file");
  const typeArg     = get("type") as AssetType | null;
  const allStores   = has("all-stores");
  const allFiles    = has("all");
  const forceFlag   = has("force");
  const listFlag    = has("list");

  // ── List mode ──
  if (listFlag) {
    const stores = allStores ? discoverStores() : storeArg ? [storeArg] : discoverStores();
    for (const s of stores) await listStoreAssets(s);
    return;
  }

  // ── Validate ──
  if (!storeArg && !allStores) {
    console.error("❌  Specify --store=s1 or --all-stores");
    console.error("\nExamples:");
    console.error("  npx tsx scripts/upload-asset.ts --store=s1 --all");
    console.error("  npx tsx scripts/upload-asset.ts --store=s1 --file=hero-1.mp4");
    console.error("  npx tsx scripts/upload-asset.ts --store=s1 --type=policies");
    console.error("  npx tsx scripts/upload-asset.ts --all-stores --all");
    console.error("  npx tsx scripts/upload-asset.ts --store=s1 --list");
    process.exit(1);
  }

  const stores = allStores ? discoverStores() : [storeArg!];

  if (stores.length === 0) {
    console.error("❌  No stores found in public/assets/stores/");
    process.exit(1);
  }

  console.log(`\n🚀  Upload-asset  ${forceFlag ? "(force mode)" : "(hash-checked)"}`);
  console.log(`    Stores : ${stores.join(", ")}`);
  console.log(`    Target : ${fileArg ?? typeArg ?? "all"}\n`);

  for (const storeId of stores) {
    if (fileArg) {
      // Single file upload
      const type = typeArg ?? resolveTypeFromFilename(fileArg);
      if (!type) {
        console.error(`❌  Cannot determine asset type for "${fileArg}". Use --type=videos|images|logo|policies`);
        process.exit(1);
      }
      console.log(`\n▶  Store: ${storeId}`);
      const result = await uploadFile(storeId, type, fileArg, forceFlag);
      const icon = result === "uploaded" ? "↑" : result === "skipped" ? "✓" : "✗";
      const label = result === "uploaded" ? "uploaded" : result === "skipped" ? "unchanged, skipping" : "not found locally";
      console.log(`  ${icon}  ${type}/${fileArg}  — ${label}`);
    } else if (typeArg) {
      // All files of one type
      console.log(`\n▶  Store: ${storeId}`);
      await uploadType(storeId, typeArg, forceFlag);
    } else if (allFiles) {
      // All types
      await uploadStore(storeId, forceFlag);
    } else {
      console.error("❌  Specify --all, --file=filename, or --type=videos|images|logo|policies");
      process.exit(1);
    }
  }

  console.log("\n✅  Done\n");
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});
