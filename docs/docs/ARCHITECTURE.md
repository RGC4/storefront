# RGC4 Multi-Store Architecture

> **Single codebase, multiple Shopify stores, independent Vercel deployments per store.**
> Status: production. Last major update: April 2026.

## What this system is

RGC4 operates multiple independent Shopify storefronts (`s1`, `s2`, `s3`, …) from a single Next.js codebase. Each storefront is a headless frontend — Next.js on Vercel — pointed at a shared Shopify backend that contains products for every store, tagged by `store_number`.

Every store looks different (logo, videos, policies, name, branding) but runs the same code. Code lives in one git repo. Assets (HTML policies, videos, images) live in Vercel Blob. Data (products, prices, descriptions) lives in Shopify.

### Key benefit

Standing up a new store does **not** require code changes. It's a provisioning workflow:

1. Upload assets for the new store to Blob
2. Add env vars to a new Vercel project
3. Tag products in Shopify with the new store number
4. Deploy

The code already knows how to serve multiple stores; the store ID is an environment variable that the code reads at runtime.

---

## The three platforms and their roles

| Platform | What lives there | How it's updated |
|---|---|---|
| **Shopify** | Products, prices, inventory, descriptions, metafields | Admin UI + nightly-sync.js |
| **Git (GitHub)** | Code: Next.js app, scripts, configuration | `git push` → Vercel auto-deploys |
| **Vercel** | Running app + Blob storage for assets | Code via git; assets via `upload-asset.ts` |

**Important mental model:** code and assets are on **separate release cycles**. You can change a policy without deploying code. You can deploy code without touching assets. They're independent pipelines.

### Shopify's role

Shopify is the **commerce engine**. It owns:

- Product catalog (titles, prices, images, inventory, variants)
- Orders, customers, payments
- The `custom.store_number` metafield that maps each product to one or more stores
- The `custom.pinterest_grid` metafield (Yes/No) that gates products from the browse grid
- Description generation tracking: `description_version`, `description_source_hash`, `description_generated_at`

Shopify exposes two APIs:
- **Storefront API** (public token, customer-facing) — what the Next.js app reads to render pages
- **Admin API** (private token, server-side) — what nightly-sync.js uses to write back

### Git's role

Git is the **code source of truth**. One repository. One branch (typically `main`). A commit triggers a Vercel deploy automatically.

**What's in git:**
- Next.js application code (`src/`, `components/`, `lib/`)
- Scripts (`scripts/upload-asset.ts`, `nightly-sync.js`, etc.)
- Configuration files (`next.config.js`, `tsconfig.json`, etc.)
- Example HTML policies for reference (`public/policies/`)

**What's NOT in git** (see `.gitignore`):
- Videos, MP4s, any binary media — too large, belong in Blob
- `.env.local` — contains secrets
- `public/assets/stores/*/videos/` — actual store media
- Per-store policy HTML currently lives in `public/assets/stores/sX/policies/` locally, and is NOT committed

### Vercel's role

Vercel does two things:

**1. Hosts the running app.** Each store has its own Vercel project (separate deployments, separate domains, separate env vars). All projects point at the same git repo but are configured with a different `NEXT_PUBLIC_STORE_ID`. Vercel builds and serves the Next.js app.

**2. Stores assets via Vercel Blob.** Logos, videos, policies, images — anything binary or per-store — lives in Blob at paths like `stores/s1/videos/hero-1.mp4`. The Next.js app reads these at request time (with a 5-minute cache).

---

## Multi-store model

The system supports N stores via environment variables alone.

### Per-store isolation

Each store is isolated by a single environment variable:

```
NEXT_PUBLIC_STORE_ID=s1       # or s2, s3, …
NEXT_PUBLIC_STORE_NAME="Imperial Accessories"
NEXT_PUBLIC_STORE_EMAIL=support@imperialaccessories.com
```

`src/lib/storeResolver.ts` reads these and drives the entire rendering pipeline — what blob path to look up for assets, what name to show in the header, what email to substitute into policy templates.

### Product → store mapping

Every product in Shopify has a `custom.store_number` metafield. The value is `s1`, `s2`, or — for products that should appear in multiple stores — `s1, s2`. The Storefront API query filters products by this metafield at request time.

Products also have `custom.pinterest_grid` (Yes/No) to control whether they appear on the browse grid. This lets the merchandiser curate the Pinterest-style layout without touching code or collections.

### Shopify credentials per store

For stores pointed at **different** Shopify backends, prefix env vars by store ID:

```
S1_SHOPIFY_DOMAIN=rgc4-3.myshopify.com
S1_STOREFRONT_TOKEN=shpat_...

S2_SHOPIFY_DOMAIN=store-two.myshopify.com
S2_STOREFRONT_TOKEN=shpat_...
```

If these aren't set, the code falls back to the default `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. In the current setup, all stores share one Shopify backend; product-level metafields do the store separation.

---

## Data flow diagrams

### Loading a product page (customer → storefront)

```
Customer requests /products/some-handle
        ↓
Next.js server component runs
        ↓
storeResolver.ts reads NEXT_PUBLIC_STORE_ID
        ↓
Storefront API GraphQL query filters products
by custom.store_number matching STORE_ID
        ↓
Product HTML rendered, sent to browser
```

### Loading a policy page

```
Customer requests /privacy-policy
        ↓
Next.js server component runs loadPolicy("privacy_policy")
        ↓
Check in-memory cache (5-min TTL) — hit = return immediately
        ↓
On miss: vercel-blob head() at stores/{storeId}/policies/privacy_policy.html
        ↓
If blob missing → FALLBACK text ("Policy not yet available")
        ↓
If blob exists → fetch HTML, transform (strip fine-print, replace brand/email), parse into sections
        ↓
Render via <PolicyPage> component
```

### Updating a policy (operator → production)

```
Edit public/assets/stores/s1/policies/privacy_policy.html locally
        ↓
npx tsx scripts/upload-asset.ts --store=s1 --file=privacy_policy.html
        ↓
Script computes MD5, compares to hash at stores/s1/.hashes/policies/privacy_policy.html.md5
        ↓
If changed: upload HTML to blob, upload new hash
        ↓
Next request: server still serves cached fallback for up to 5 min
        ↓
After 5 min or server restart: new policy live
```

### Nightly catalog sync

```
Cron runs: node nightly-sync.js
        ↓
Admin API pulls all products (title, vendor, tags, metafields)
        ↓
Step 5: sync metafields
  - store_number (from Women/Men tags)
  - sku, msrp, cost, gross_profit, selling_price
  - pinterest_grid=Yes if blank
        ↓
Step 6: tiered pricing logic
        ↓
Step 7: description sync
  - Compute hash of (title + vendor + type + tags)
  - If hash matches existing description_source_hash: SKIP (fast path)
  - Otherwise: Ollama regenerates description, updates metafields
```

---

## Key files and their purposes

### Application code

| File | Purpose |
|---|---|
| `src/lib/storeResolver.ts` | Reads `NEXT_PUBLIC_STORE_ID`, resolves per-store config |
| `src/lib/policyLoader.ts` | Fetches policy HTML from Blob, transforms, parses into sections |
| `src/lib/shopify.ts` | Storefront API client — product queries with metafield filters |
| `src/components/PolicyPage.tsx` | Renders policy data as a styled page |
| `src/app/privacy-policy/page.tsx` | Loads and displays privacy policy |
| `src/app/return-policy/page.tsx` | Loads and displays return policy |
| `src/app/shipping-policy/page.tsx` | Loads and displays shipping policy |
| `src/app/browse/page.tsx` | Pinterest-style grid (products filtered by store + pinterest_grid) |

### Scripts

| Script | Purpose |
|---|---|
| `scripts/upload-asset.ts` | Push local assets to Vercel Blob with hash-based change detection |
| `nightly-sync.js` (in `shopify catalog checker/`) | Nightly product sync: metafields, prices, descriptions |
| `pinterest-grid/` | Standalone dev prototype for the browse grid (separate from production) |

### Asset locations

**Locally:**
```
public/assets/stores/s1/
├── policies/privacy_policy.html
├── policies/refund_policy.html
├── policies/shipping_policy.html
├── policies/terms_conditions.html
├── videos/hero-1.mp4
├── images/...
└── logo/...
```

**In Vercel Blob** (mirrors local structure):
```
stores/s1/policies/privacy_policy.html
stores/s1/videos/hero-1.mp4
stores/s1/.hashes/policies/privacy_policy.html.md5
```

---

## Critical metafields

All live in the `custom` namespace.

| Key | Type | Purpose |
|---|---|---|
| `custom.store_number` | single_line_text | Which store(s) this product belongs to (e.g., `s1` or `s1, s2`) |
| `custom.pinterest_grid` | single_line_text | `Yes`/`No` — show in browse grid |
| `custom.description_version` | single_line_text | Version stamp (e.g., `v1`) — bump to force-regenerate descriptions |
| `custom.description_source_hash` | single_line_text | Hash of inputs; if matches, skip Ollama |
| `custom.description_generated_at` | date_time | When the description was last generated |
| `custom.sku`, `custom.msrp`, `custom.cost`, `custom.gross_profit`, `custom.selling_price` | various | Pricing and inventory tracking |
| `custom.brandsgateway_id` | single_line_text | External supplier ID |

---

## Caching behavior

Understanding caching is critical for debugging "I changed X but don't see it."

| Layer | TTL | Notes |
|---|---|---|
| `policyLoader` in-memory | 5 minutes | Per serverless function instance |
| Next.js page revalidation | 60 seconds (browse page) | Set per-page via `export const revalidate = 60` |
| Storefront API `next.revalidate` | 60 seconds | GraphQL responses cached |
| Vercel Blob | None | Always served fresh |
| Shopify CDN | Hours | Images aren't our concern; Shopify controls |

**When you update something and don't see the change:**
1. Hard-refresh in browser (Ctrl+F5) — rules out browser cache
2. Wait 60 seconds — page revalidation
3. Wait 5 minutes — policyLoader cache (if it's a policy)
4. Redeploy the Vercel project — flushes everything instantly

---

## Backup strategy

Tonight's incident (broken policies after a deploy) happened because Blob wasn't populated. Lesson: have a backup plan for every asset layer.

**Recommended:**

| What | Primary | Backup |
|---|---|---|
| Code | Git (GitHub) | Your laptop + any team member's laptop |
| Policies | Vercel Blob | Local `public/assets/stores/` folder (source of truth) |
| Videos | Vercel Blob | Local folder (same) |
| Environment variables | Vercel dashboard | A private `.env.reference.local` outside git |
| Everything else | Cloud sync (OneDrive/Dropbox) of `C:\Users\bobci\Documents\RGC4` |

**Do not:** commit videos or large binaries to git. The `.gitignore` already prevents this.

---

## Known weirdnesses

Worth knowing, not worth fixing right now:

1. **First-run policy rendering can be blank** — if a new Vercel deploy runs before assets are uploaded, the server caches the FALLBACK for 5 minutes. Always upload assets before a new store's first live request.

2. **Nightly-sync description fast path depends on three metafields** — `description_version`, `description_source_hash`, `description_generated_at`. The first night after this was rolled out, every product regenerates because no hash exists yet. Subsequent nights are fast.

3. **`pinterest_grid=Yes` default is set by nightly-sync, not webhook.** If you add a product manually and expect it to appear in the grid, either set the metafield yourself or wait for the nightly run.

4. **`policyLoader` transforms HTML on every render** (stripping fine-print, replacing brand names). This is done in code rather than at upload time, so changing the transforms requires a code deploy, not an asset re-upload.

---

## Where to go from here

- **Provisioning a new store:** see `runbooks/new-store.md`
- **Daily operations** (update a policy, swap a video, etc.): see `runbooks/daily-operations.md`
- **Troubleshooting production issues:** see `runbooks/troubleshooting.md` (TBD)
