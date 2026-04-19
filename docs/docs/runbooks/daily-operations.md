# Runbook: Daily Operations

> Quick reference for common tasks. Each section is a standalone recipe.
> If a task starts requiring code edits, something's wrong — stop and reconsider.

---

## Update a policy (privacy, refund, shipping, terms)

**Effort:** 2 minutes.

```powershell
# 1. Edit the file locally
notepad C:\dev\s1\public\assets\stores\s1\policies\privacy_policy.html

# 2. Upload just that file
cd C:\dev\s1
npx tsx scripts/upload-asset.ts --store=s1 --file=privacy_policy.html

# 3. Wait up to 5 minutes, then verify
#    https://yourstore.com/privacy-policy
```

**If the change doesn't appear after 5 minutes:**
- Hard-refresh browser (Ctrl+F5)
- Redeploy Vercel (flushes server-side cache instantly)

---

## Replace or add a video

**Effort:** 2 minutes + upload time (videos are large).

```powershell
# 1. Replace the file locally. Keep the same filename to swap instantly.
#    C:\dev\s1\public\assets\stores\s1\videos\hero-1.mp4

# 2. Upload
cd C:\dev\s1
npx tsx scripts/upload-asset.ts --store=s1 --file=hero-1.mp4

# 3. Hard-refresh browser to see the new video
```

Tip: the script hashes files before uploading, so running it on unchanged files is a no-op. Re-running `--all` after any edit is always safe.

---

## Hide a product from the Pinterest grid

**Effort:** 30 seconds per product.

1. Shopify admin → **Products** → find the product
2. Scroll to Metafields panel on the right
3. **Pinterest Grid** → change to `No`
4. Save

The change appears on `/browse` within 60 seconds (grid revalidation period). If you don't see it, hard-refresh.

**To hide many products at once:** Products → filter by vendor or product type → select all matching → Bulk edit → add Pinterest Grid column → set to `No` → Save.

---

## Show a product in the Pinterest grid

Same as above, set **Pinterest Grid** to `Yes`.

Newly added products (after nightly-sync runs) auto-default to `Yes`. This is configured in `nightly-sync.js`.

---

## Add a product to a specific store

Every product has a `custom.store_number` metafield. Values are store IDs separated by commas.

**To add a product to store `s2`:**
- If currently `s1`: change to `s1, s2`
- If currently blank: change to `s2`

Admin → Products → the product → Metafields → **Store Number** → edit → Save.

Within 60 seconds, the product appears on that store's storefront.

---

## Update a product description manually (and make it stick)

The nightly-sync runs Ollama to generate descriptions. If you manually edit a description, it will be **overwritten** on the next sync unless you prevent that.

**To make a manual edit permanent:**

1. Edit the description in Shopify admin
2. In the same product's Metafields, clear these fields:
   - `Description Source Hash` → blank (or set to `MANUAL`)
3. Next nightly-sync will still consider regenerating (hash mismatch), but you can prevent that by... *(TBD — we need a `lock` mechanism for manual edits. For now, the reliable path is: edit, and if nightly overwrites, you'll see it in the sync logs the next day.)*

**To force regenerate a single product:**
- Clear its `Description Source Hash` metafield
- Run nightly-sync (or wait for tonight)

**To force regenerate ALL products:**
- In `nightly-sync.js`, bump `DESCRIPTION_VERSION` from `"v1"` to `"v2"`
- Commit, deploy
- Run nightly-sync — every product regenerates because version doesn't match

---

## Deploy code changes

```powershell
cd C:\dev\s1
git add .
git commit -m "describe what you changed"
git push
```

Vercel auto-detects the push and redeploys every store that tracks this repo. Each store has its own env vars, so the same code behaves correctly everywhere.

**Verify deployment:**
- Vercel dashboard → each store project → Deployments tab → most recent should be green
- Visit each store's live URL and smoke-test

**If one store breaks but others don't:**
- Check that store's env vars didn't change
- Check Vercel runtime logs for that specific project

---

## Roll back a broken deployment

Vercel keeps every past deployment. To instantly revert:

1. Vercel dashboard → affected project → **Deployments**
2. Find the last known-good deployment
3. Click the `⋯` menu → **Promote to Production**

Production points to the old version within 30 seconds. Then you can diagnose the broken one without pressure.

---

## Add a new metafield to products

**Effort:** 5–10 minutes + nightly sync.

### Step 1: Define the metafield in Shopify

1. Admin → **Settings** → **Custom data** → **Products** → **Add definition**
2. Name it (human-readable) and ensure namespace/key is `custom.your_key_name`
3. Pick the type (usually `single_line_text_field`)
4. Save

### Step 2: Populate values

**Option A (manual):** edit each product individually in admin.

**Option B (bulk edit):** filter → select all → bulk edit → add the column → fill → save.

**Option C (nightly-sync):** add logic to `nightly-sync.js` in the metafields block (around line 590). Example:

```javascript
updates.push({
  key: "your_key_name",
  value: "some_value",
  type: "single_line_text_field"
});
```

### Step 3: Use it in the frontend

Query it in the Storefront API call (`src/lib/shopify.ts`), add it to the product type, render it where needed. This *is* a code change — only do this when the metafield needs to be visible to customers.

---

## Regenerate descriptions for a specific store

```powershell
cd "C:\Users\bobci\Documents\RGC4\shopify\tools\shopify catalog checker"

# Preview what would change
node nightly-sync.js --dry-run --limit 5

# If that looks right, run for real
node nightly-sync.js
```

Only products whose `description_source_hash` doesn't match (or is blank) will regenerate. Already-generated products are skipped fast.

---

## Rotate the Storefront API token

**When:** you accidentally leak it, or for security hygiene every 6 months.

1. Shopify admin → **Settings** → **Apps and sales channels** → **Develop apps** → your app
2. **Storefront API access tokens** → delete the compromised one
3. **Create a new token** → reveal → copy
4. Update `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in:
   - Every Vercel project (each store) → **Settings** → **Environment variables** → edit → **Save**
   - Your local `.env.local` files
5. Redeploy each Vercel project (env var changes don't auto-trigger a deploy)

---

## Rotate the Admin API token

Same pattern as Storefront, but under **Admin API access tokens**. Admin tokens are higher-privilege, so:

- Update `SHOPIFY_ADMIN_ACCESS_TOKEN` in your local `.env.local` (where `nightly-sync.js` reads it)
- Storefront-only env vars in Vercel don't need updating — production code doesn't use the Admin token

---

## Rotate the Vercel Blob token

1. Vercel dashboard → **Storage** → **Blob** → **Tokens** tab
2. Create new token → copy
3. Update `BLOB_READ_WRITE_TOKEN` in:
   - Every Vercel project's env vars
   - Your local `.env.local`
4. Revoke the old token once you've verified the new one works

---

## Debug: "why isn't my change showing up?"

Work through this ladder in order:

1. **Browser cache:** Ctrl+F5 to hard-refresh
2. **Next.js page cache:** wait 60 seconds (page revalidation)
3. **policyLoader cache:** wait 5 minutes (policy-specific)
4. **Deploy cache:** redeploy from Vercel dashboard (flushes all server-side)
5. **Asset not uploaded:** re-run `upload-asset.ts --store=sN --all` (safe, hash-checked)
6. **Env var not set:** Vercel project → env vars → confirm the expected value
7. **Product doesn't match store filter:** Shopify admin → product → check `custom.store_number` and `custom.pinterest_grid`
8. **Runtime error:** Vercel → Deployments → latest → Runtime logs → look for `[policyLoader]`, stack traces

---

## Debug: "the whole site is broken"

1. Vercel dashboard → affected project → **Deployments** → is the latest green or red?
2. If red → click it → Build logs show the error
3. If green but site is broken → Runtime logs show what's failing
4. Worst case → promote the previous deployment to production (see "Roll back" above)
