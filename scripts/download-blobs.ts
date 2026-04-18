// scripts/download-blobs.ts
// ============================================================
// Download store assets from Vercel Blob back to local public/ directory.
// Sends the BLOB_READ_WRITE_TOKEN so it works with private blobs.
//
// Usage:
//   npx tsx scripts/download-blobs.ts --store=s1 --type=videos
//   npx tsx scripts/download-blobs.ts --store=s1
//   npx tsx scripts/download-blobs.ts --store=s1 --force
// ============================================================

import { list } from "@vercel/blob";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "";
if (!TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN not found in .env.local");
  process.exit(1);
}

const args = process.argv.slice(2);
const storeArg = args.find(a => a.startsWith("--store="))?.split("=")[1];
const typeArg = args.find(a => a.startsWith("--type="))?.split("=")[1];
const forceFlag = args.includes("--force");

if (!storeArg) {
  console.error("Usage: npx tsx scripts/download-blobs.ts --store=s1 [--type=videos] [--force]");
  process.exit(1);
}

(async () => {
  const prefix = typeArg
    ? `stores/${storeArg}/${typeArg}/`
    : `stores/${storeArg}/`;

  console.log(`Listing blobs with prefix: ${prefix}`);
  const { blobs } = await list({ prefix });

  // Skip hash files - we only want real assets
  const assetBlobs = blobs.filter(b => !b.pathname.includes("/.hashes/"));

  if (assetBlobs.length === 0) {
    console.log("No assets found.");
    return;
  }

  console.log(`Found ${assetBlobs.length} assets.`);

  for (const blob of assetBlobs) {
    const localPath = join(process.cwd(), "public", "assets", blob.pathname);

    if (existsSync(localPath) && !forceFlag) {
      console.log(`  SKIP (exists):  ${blob.pathname}`);
      continue;
    }

    mkdirSync(dirname(localPath), { recursive: true });

    console.log(`  DOWNLOAD:       ${blob.pathname}  (${blob.size} bytes)`);
    const res = await fetch(blob.url, {
      headers: { authorization: `Bearer ${TOKEN}` },
    });
    if (!res.ok) {
      console.error(`  FAILED:  ${blob.pathname}  (${res.status})`);
      continue;
    }
    writeFileSync(localPath, Buffer.from(await res.arrayBuffer()));
  }

  console.log("Done.");
})();
