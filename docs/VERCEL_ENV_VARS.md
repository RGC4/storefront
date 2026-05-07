# Per-Store Vercel Environment Variables

This document lists the env vars each Vercel project (one per store) must set.
Set under: **Vercel dashboard → \<project\> → Settings → Environment Variables**

The codebase reads every store-specific value from these vars. There are NO
hardcoded store names, URLs, or supply-chain values in code — onboarding a new
store is a Vercel-only operation; no code changes required.

---

## REQUIRED — set on every store (no defaults; missing vars produce empty values in JSON-LD)

| Variable | Example value (Imperial) | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_STORE_ID` | `s1` | Multi-tenant tagging — products in Shopify are tagged with this ID to be visible in this store |
| `NEXT_PUBLIC_STORE_NAME` | `Imperial Accessories` | Display name everywhere (header, footer, JSON-LD, page titles) |
| `NEXT_PUBLIC_STORE_URL` | `https://www.imperialaccessories.com/` | Canonical site URL for OG, sitemap, JSON-LD; trailing slash auto-stripped by code |
| `NEXT_PUBLIC_STORE_EMAIL` | `info@imperialaccessories.com` | Footer contact, support links |
| `NEXT_PUBLIC_STORE_PHONE` | `+1 (630) 479-8118` | Footer contact |
| `NEXT_PUBLIC_STORE_ADDRESS` | `1 East Erie St Suite 525-4419, Chicago, IL 60611` | Footer + Organization JSON-LD |
| `NEXT_PUBLIC_STORE_DESCRIPTION` | `Authenticated luxury designer handbags from Italy, new with tags.` | Organization JSON-LD description (Google Knowledge Panel) |
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` | Shopify Storefront API host |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | (token) | Shopify Storefront API auth |

---

## SHIPPING — Product JSON-LD shippingDetails

If unset, code uses generic defaults (US-to-US, 1-3 day handling, 3-7 day transit, free).

| Variable | Imperial / Prestige | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SHIPPING_ORIGIN_COUNTRY` | `IT` | ISO country code where products ship FROM |
| `NEXT_PUBLIC_SHIPPING_DEST_COUNTRY` | `US` | ISO country code where you ship TO (single value) |
| `NEXT_PUBLIC_SHIPPING_HANDLING_MIN` | `1` | Days to process and pack the order, lower bound |
| `NEXT_PUBLIC_SHIPPING_HANDLING_MAX` | `2` | Upper bound |
| `NEXT_PUBLIC_SHIPPING_TRANSIT_MIN` | `5` | Days in transit, lower bound |
| `NEXT_PUBLIC_SHIPPING_TRANSIT_MAX` | `10` | Upper bound |
| `NEXT_PUBLIC_SHIPPING_RATE_VALUE` | `0` | Shipping cost, as string. Use `0` for free |
| `NEXT_PUBLIC_SHIPPING_RATE_CURRENCY` | `USD` | ISO currency code |

---

## RETURNS — Product JSON-LD hasMerchantReturnPolicy

If unset, code uses generic defaults (US, 30 days, free, mail).

| Variable | Imperial / Prestige | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_RETURN_COUNTRY` | `US` | Country where return policy applies |
| `NEXT_PUBLIC_RETURN_DAYS` | `14` | Return window in days |
| `NEXT_PUBLIC_RETURN_FEE` | `FreeReturn` | One of: `FreeReturn`, `ReturnShippingFees`, `ReturnFeesCustomerResponsibility` |
| `NEXT_PUBLIC_RETURN_METHOD` | `ReturnByMail` | One of: `ReturnByMail`, `ReturnInStore`, `ReturnAtKiosk` |

---

## OPTIONAL — branding, hero, social

These already exist in your `.env.local` template. Set them per project as needed.
Falling back to defaults won't break the build but produces visibly empty content.

- `NEXT_PUBLIC_PRIMARY_COLOR`, `NEXT_PUBLIC_SECONDARY_COLOR`
- `NEXT_PUBLIC_LOGO_URL`, `NEXT_PUBLIC_LOGO_HEADER_URL`, `NEXT_PUBLIC_LOGO_FOOTER_URL`
- `NEXT_PUBLIC_HERO_TITLE`, `NEXT_PUBLIC_HERO_SUBTITLE`, `NEXT_PUBLIC_HERO_TAGLINE`, `NEXT_PUBLIC_HERO_BUTTON_TEXT`, `NEXT_PUBLIC_HERO_BUTTON_LINK`
- `NEXT_PUBLIC_FOOTER_DESCRIPTION`
- `NEXT_PUBLIC_SOCIAL_FACEBOOK`, `NEXT_PUBLIC_SOCIAL_INSTAGRAM`, `NEXT_PUBLIC_SOCIAL_TWITTER`, `NEXT_PUBLIC_SOCIAL_YOUTUBE`, `NEXT_PUBLIC_SOCIAL_GOOGLE`
- `NEXT_PUBLIC_GA_ID` (Google Analytics)
- `NEXT_PUBLIC_PINTEREST_TAG_ID` (Pinterest tracking)

---

## NEW STORE ONBOARDING CHECKLIST

When adding a new tenant (e.g. a fishing-pole store):

1. Create a new Vercel project, point it at this same repo
2. Set the REQUIRED vars above with that store's values
3. Set SHIPPING + RETURNS for that store's actual fulfillment (or accept defaults)
4. Set OPTIONAL branding vars
5. In Shopify, tag relevant products with the new `STORE_ID` so the multi-tenant filter shows them
6. Add custom domain in Vercel project settings
7. Verify the domain in Google Search Console, submit `/sitemap.xml`
8. Run Rich Results Test on a product URL to confirm Product JSON-LD validates

No code changes. No file edits. No deploy of the storefront repo. Pure config.
