# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # next dev
npm run build            # next build
npm start                # next start (production)
npm run lint             # next lint
npm run lint:fix         # eslint . --fix
npm run format           # prettier --write .
npm run format:check     # prettier --check .
```

Asset sync to Vercel Blob (policies, logos, videos, hero images):

```bash
npx tsx scripts/upload-asset.ts --store=s1 --file=<filename>   # single file
npx tsx scripts/upload-asset.ts --store=s1 --type=policies     # all of one type
npx tsx scripts/upload-asset.ts --store=s1 --all               # all changed for one store
npx tsx scripts/upload-asset.ts --all-stores --all             # all changed for all stores
npx tsx scripts/upload-asset.ts --store=s1 --list              # inspect current blob contents
```

There is no configured test runner. Files like `test-products.mjs`, `test-shopify.mjs` are ad-hoc scripts, not a suite.

## Architecture

This is a **multi-store Shopify headless storefront**: one Next.js 16 (App Router, React 19, MUI v7) codebase powers N independent Shopify storefronts. Each store is a separate Vercel project pointing at the same git repo, differentiated only by environment variables. See `docs/docs/ARCHITECTURE.md` for the full operational picture.

### Three-platform separation of concerns

- **Shopify** owns the catalog (products, prices, inventory) and metafields. All stores share one Shopify backend; product-level metafields do the store separation.
- **Git / Vercel** owns the code. Each store is its own Vercel project with different env vars.
- **Vercel Blob** owns per-store assets (logos, videos, policy HTML) under `stores/{storeId}/...`. Assets ship independently of code — no redeploy needed to update a policy.

Code and assets are on **separate release cycles**. Never commit videos/large media — `.gitignore` blocks `*.mp4`, `*.mov`, `public/assets/stores/*/videos/`.

### The store resolver is the keystone

`src/lib/storeResolver.ts` reads `NEXT_PUBLIC_STORE_ID` (e.g. `s1`) and `NEXT_PUBLIC_STORE_NAME` at runtime and returns the per-store `StoreConfig`. Everything downstream (blob paths, Shopify query filters, displayed store name, email substitutions in policies) flows from this.

Per-store Shopify credentials are looked up as `S{N}_SHOPIFY_DOMAIN` / `S{N}_STOREFRONT_TOKEN`, falling back to the default `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Current setup: one shared Shopify backend, store separation is purely via metafields.

### Product-to-store mapping via metafields (namespace `custom`)

- `custom.store_number` — comma-separated store IDs (e.g. `s1` or `s1, s2`). Storefront API queries filter on this.
- `custom.pinterest_grid` — `Yes`/`No` gate for the browse grid.
- `custom.description_version`, `custom.description_source_hash`, `custom.description_generated_at` — description regeneration fast-path (nightly-sync skips products whose input hash matches).

### Policy loading (`src/lib/policyLoader.ts`)

Server component → `loadPolicy("privacy_policy")` → checks 5-min in-memory cache → on miss hits `stores/{storeId}/policies/*.html` in Blob → transforms HTML (strips fine-print, substitutes brand/email) → parses into sections → rendered via `src/components/PolicyPage.tsx`. **HTML transforms are applied per-render**, so changing them requires a code deploy, not an asset re-upload.

### Shopify Storefront API client (`lib/shopify.ts` at repo root, plus `src/lib/shopify.ts`)

All cart mutations use `cache: "no-store"` — do not cache them. Product queries use `next.revalidate = 60`. Cart drawer / full-cart state is in `src/contexts/CartContext`.

## Caching (critical for "I changed X but don't see it")

| Layer | TTL |
|---|---|
| `policyLoader` in-memory | 5 min per serverless instance |
| Next.js page `revalidate` (e.g. `/browse`) | 60 s |
| Storefront API responses | 60 s |
| Vercel Blob | none (always fresh) |

Redeploying the Vercel project is the nuclear option — flushes everything instantly.

## Conventions and gotchas

- `next.config.js` sets `typescript.ignoreBuildErrors: true`. The build won't fail on TS errors — run `tsc --noEmit` manually if you need a real check.
- `eslint.config.mjs` disables `@typescript-eslint/no-unused-vars`, `no-explicit-any`, `no-empty-object-type`, and several `react/*` rules. Don't reintroduce them.
- Path alias `@/*` → `src/*`; `lib/*` → `../lib/*` (repo-root `lib/`).
- Prettier: 100 cols, double quotes, no trailing commas, LF endings.
- `src/__server__/__db__/` contains demo data from the original Bazaar template (fashion-1, grocery-2, etc.) — most of it is unused by the live store. Don't add to it without checking whether it's wired up.
- `.bak` / `.bak-*` files exist alongside live files (e.g. `layout.tsx.bak`, `robots.ts.bak`). These are pre-refactor snapshots — don't edit them, and don't let them mislead grep results.
- Windows dev environment: PowerShell is the default shell for operator runbooks, but this harness uses bash (Unix syntax).

## Documentation

- `docs/docs/ARCHITECTURE.md` — full system overview, data flows, known weirdnesses. Read first if you're new.
- `docs/docs/runbooks/new-store.md` — provisioning a new store end-to-end.
- `docs/docs/runbooks/daily-operations.md` — common operator tasks (update a policy, swap a video, toggle a product).
- `ASSETS.md` — blob layout and `upload-asset.ts` usage reference.
