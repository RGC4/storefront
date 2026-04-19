# Runbook: Standing Up a New Store

> **Goal:** take a new store (`sN`) from zero to live, end-to-end. Target completion: 90 minutes.
> **Prereqs:** you have admin access to Shopify, Vercel, and the RGC4 GitHub repo. Node.js installed locally.

---

## Overview

Standing up a new store means creating a new **independent Vercel deployment** that serves a new **subset of products** from the shared Shopify backend, with its own **branding**, **domain**, and **policies**.

At no point should this require a code change.

### Naming convention

Stores are identified by `s1`, `s2`, `s3`, … — a short, URL-safe ID. Pick the next number. This doc uses `sN` as a placeholder; substitute (e.g. `s4`) throughout.

---

## Phase 1: Prepare assets (local)

### 1.1 — Create the folder structure

Under your local project root (`C:\dev\s1`):

```powershell
cd C:\dev\s1\public\assets\stores
mkdir sN
mkdir sN\policies
mkdir sN\videos
mkdir sN\images
mkdir sN\logo
```

### 1.2 — Drop in assets

Put these in the corresponding folders:

| Folder | Files |
|---|---|
| `sN/policies/` | `privacy_policy.html`, `refund_policy.html`, `shipping_policy.html`, `terms_conditions.html` (also `about.html` if you have one) |
| `sN/videos/` | Hero/promotional MP4s — `hero-1.mp4` etc. |
| `sN/images/` | Banner images, lifestyle shots |
| `sN/logo/` | The store's logo (SVG preferred, PNG acceptable) |

**Use existing stores as templates.** Copy `s1/policies/privacy_policy.html` to your new folder and edit brand name, email, and specifics. The `<h1 class="policy-title">`, section `<h2>`s, and overall structure should stay consistent so `policyLoader.ts` can parse correctly.

### 1.3 — Customize policy HTML

Open each policy file and update:
- Brand name (appears in the `<h1>` and `<div class="brand">` sections)
- Contact email (mailto links)
- Any store-specific clauses

Don't touch the section structure (`<h2>` headings). `policyLoader` uses these to parse.

---

## Phase 2: Upload assets to Vercel Blob

```powershell
cd C:\dev\s1
npx tsx scripts/upload-asset.ts --store=sN --all
```

Expected output:

```
▶  Store: sN
  ↑  policies/privacy_policy.html  — uploaded
  ↑  policies/refund_policy.html  — uploaded
  ↑  policies/shipping_policy.html  — uploaded
  ↑  policies/terms_conditions.html  — uploaded
  ↑  videos/hero-1.mp4  — uploaded
  ↑  logo/logo.svg  — uploaded
✅  Done
```

If you see errors:
- **`BLOB_READ_WRITE_TOKEN not found`** — your local `.env.local` is missing the token. Get it from Vercel dashboard → your team settings → Tokens
- **Network timeouts** — retry; Blob occasionally throttles large video uploads

---

## Phase 3: Configure Shopify

### 3.1 — Tag products

Every product belonging to this new store needs `custom.store_number` to contain `sN`.

**Option A — Add to the existing value (product appears in multiple stores):**

Example: product is currently `s1`. You want it in `s1` and `sN`. Set metafield to `s1, sN`.

**Option B — Replace with just `sN`:**

Set metafield value to `sN`.

**Fastest way to do this in bulk:**

1. Shopify admin → Products
2. Filter: `custom.store_number contains <old value>` OR filter by vendor/collection that describes your new store's scope
3. Select all matching → Bulk edit
4. Add metafield column → set value
5. Save

### 3.2 — Verify pinterest_grid is set

If you want these products to appear in the browse grid immediately, set `custom.pinterest_grid = Yes` in the same bulk edit. Otherwise they'll populate on the next nightly-sync run.

### 3.3 — Verify descriptions exist

New products won't show on the storefront if they have no description. Either:
- Wait for nightly-sync (Ollama generates them)
- Manually add descriptions in Shopify admin

---

## Phase 4: Create the Vercel project

### 4.1 — New project from existing repo

1. Vercel dashboard → **Add new…** → **Project**
2. Import the **same GitHub repo** you use for all stores (not a new repo)
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave default

**Don't deploy yet** — set env vars first.

### 4.2 — Configure environment variables

In the new project → **Settings** → **Environment variables**. Add (Production + Preview + Development, unless noted):

**Store identity** (required, unique to this store):
```
NEXT_PUBLIC_STORE_ID            = sN
NEXT_PUBLIC_STORE_NAME          = Your Store Name
NEXT_PUBLIC_STORE_EMAIL         = support@yourstorename.com
```

**Shopify access** (shared if all stores use one Shopify backend, otherwise prefix with `SN_`):
```
SHOPIFY_STORE_DOMAIN            = rgc4-3.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN = shpat_...
SHOPIFY_API_VERSION             = 2026-01
```

**Vercel Blob** (shared across all stores):
```
BLOB_READ_WRITE_TOKEN           = vercel_blob_rw_...
```

**Other secrets you use** (Stripe, analytics, etc. — copy from an existing store's config).

### 4.3 — Deploy

Click **Deploy**. Vercel pulls the latest code from `main`, builds it with the new env vars, and puts it at a Vercel preview URL like `sN-xyz.vercel.app`.

### 4.4 — Smoke test the preview URL

Before attaching a custom domain, verify basic functionality:

| Test | Expected |
|---|---|
| Homepage loads | Store name/logo correct |
| `/browse` | Shows products tagged with your store |
| `/privacy-policy` | Renders your uploaded HTML, not FALLBACK |
| A product detail page | Correct product, correct store's branding |

**If policies show "This policy page is not yet available":**
- Asset upload failed or is still propagating
- Check Vercel runtime logs for `[policyLoader] No blob found at stores/sN/policies/...`
- Re-run upload-asset.ts

**If the browse page is empty:**
- Products don't have `custom.store_number = sN`
- Run nightly-sync or fix metafields manually

---

## Phase 5: Attach the custom domain

### 5.1 — Add domain in Vercel

Project → **Settings** → **Domains** → **Add**. Enter the store's domain (e.g. `yournewstorename.com`).

Vercel will show the DNS records to configure. Typically:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` (Vercel's IP) |
| CNAME | `www` | `cname.vercel-dns.com` |

### 5.2 — Update DNS

Wherever your domain is registered (GoDaddy, Namecheap, Cloudflare, etc.), update the A and CNAME records to match.

DNS propagation usually takes 10–60 minutes. Vercel will issue an SSL certificate automatically once DNS resolves.

### 5.3 — Verify

Visit the custom domain. Should show your new store, with HTTPS green-lock, and all smoke-test checks still passing.

---

## Phase 6: Run first nightly-sync

Once products are tagged and the site is live:

```powershell
cd "C:\Users\bobci\Documents\RGC4\shopify\tools\shopify catalog checker"
node nightly-sync.js --dry-run
```

Review the output. Should show:
- Products needing descriptions (`[7/7] Syncing descriptions...`)
- Metafields to update (`[5/7] Updating metafields...`)

If the dry-run looks right:

```powershell
node nightly-sync.js
```

First run will take longer because no descriptions exist yet for this store's products. Subsequent runs are fast (hash-based skip).

---

## Phase 7: Final verification

Checklist — all should be yes:

- [ ] `https://yournewstorename.com/` loads, shows correct branding
- [ ] `/privacy-policy`, `/return-policy`, `/shipping-policy` render content (not FALLBACK)
- [ ] `/browse` shows products and they're all from this store (no products from other stores leaking in)
- [ ] A product detail page loads correctly
- [ ] Images/videos load (no broken links in the hero section)
- [ ] The logo in the header matches what you uploaded
- [ ] Footer email/contact info is correct
- [ ] Store is SEO-configured (title tags, meta descriptions) — these come from `storeMetadata()` reading your env vars

---

## Post-launch: monitoring

- **Vercel dashboard** → your new project → Analytics: watch for 404s, 500s
- **Vercel → Logs**: look for `[policyLoader]` warnings if policies break again
- **Shopify → Analytics**: verify sales are being attributed correctly

---

## Appendix: what you just did, conceptually

You didn't deploy new code. You:

1. Added a new *instance* of an existing app by creating a Vercel project with different env vars
2. Populated that instance's asset namespace in Blob
3. Tagged products in Shopify so they'd match the new instance's store filter

The code didn't change. **This is the whole point of the architecture.**

Going forward, standing up a new store should follow this runbook exactly. If anything in this runbook required a code edit, that's a gap in the platform — file an issue to make it configurable instead.
