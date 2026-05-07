// ============================================================
// STORE CONFIGURATION
// Single source of truth for per-tenant settings.
// Every value is driven by Vercel env vars (one Vercel project per store).
// Defaults are GENERIC and safe for any retailer — never store-specific.
// New stores onboard by setting env vars only; this file does not change.
// ============================================================

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

const storeConfig = {
  // ── Store identity ──
  storeId:        process.env.NEXT_PUBLIC_STORE_ID         || "",
  name:           process.env.NEXT_PUBLIC_STORE_NAME       || "",
  email:          process.env.NEXT_PUBLIC_STORE_EMAIL      || "",
  phone:          process.env.NEXT_PUBLIC_STORE_PHONE      || "",
  address:        process.env.NEXT_PUBLIC_STORE_ADDRESS    || "",
  siteUrl:        stripTrailingSlash(process.env.NEXT_PUBLIC_STORE_URL || ""),
  description:    process.env.NEXT_PUBLIC_STORE_DESCRIPTION || "",

  // ── Shopify connection ──
  shopifyDomain:    process.env.SHOPIFY_STORE_DOMAIN              || "",
  storefrontToken:  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN   || "",
  apiVersion:       process.env.SHOPIFY_API_VERSION               || "2026-01",

  // ── Branding ──
  primaryColor:    process.env.NEXT_PUBLIC_PRIMARY_COLOR   || "#D23F57",
  secondaryColor:  process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#2B3445",
  logo:        process.env.NEXT_PUBLIC_LOGO_URL         || "",
  logoHeader:  process.env.NEXT_PUBLIC_LOGO_HEADER_URL  || "",
  logoFooter:  process.env.NEXT_PUBLIC_LOGO_FOOTER_URL  || "",

  // ── Hero ──
  heroTitle:        process.env.NEXT_PUBLIC_HERO_TITLE         || "",
  heroSubtitle:     process.env.NEXT_PUBLIC_HERO_SUBTITLE      || "",
  heroTagline:      process.env.NEXT_PUBLIC_HERO_TAGLINE       || "",
  heroButtonText:   process.env.NEXT_PUBLIC_HERO_BUTTON_TEXT   || "Shop Now",
  heroButtonLink:   process.env.NEXT_PUBLIC_HERO_BUTTON_LINK   || "/collections",

  // ── Footer ──
  footerDescription: process.env.NEXT_PUBLIC_FOOTER_DESCRIPTION || "",

  // ── Social ──
  social: {
    facebook:  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK  || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    twitter:   process.env.NEXT_PUBLIC_SOCIAL_TWITTER   || "",
    youtube:   process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE   || "",
    google:    process.env.NEXT_PUBLIC_SOCIAL_GOOGLE    || "",
  },

  // ── Shipping (Product JSON-LD shippingDetails) ──
  shipping: {
    originCountry:      process.env.NEXT_PUBLIC_SHIPPING_ORIGIN_COUNTRY    || "US",
    destinationCountry: process.env.NEXT_PUBLIC_SHIPPING_DEST_COUNTRY      || "US",
    handlingDaysMin: Number(process.env.NEXT_PUBLIC_SHIPPING_HANDLING_MIN ?? 1),
    handlingDaysMax: Number(process.env.NEXT_PUBLIC_SHIPPING_HANDLING_MAX ?? 3),
    transitDaysMin:  Number(process.env.NEXT_PUBLIC_SHIPPING_TRANSIT_MIN  ?? 3),
    transitDaysMax:  Number(process.env.NEXT_PUBLIC_SHIPPING_TRANSIT_MAX  ?? 7),
    rateValue:    process.env.NEXT_PUBLIC_SHIPPING_RATE_VALUE    || "0",
    rateCurrency: process.env.NEXT_PUBLIC_SHIPPING_RATE_CURRENCY || "USD",
  },

  // ── Returns (Product JSON-LD hasMerchantReturnPolicy) ──
  returns: {
    applicableCountry: process.env.NEXT_PUBLIC_RETURN_COUNTRY  || "US",
    daysToReturn:    Number(process.env.NEXT_PUBLIC_RETURN_DAYS ?? 30),
    returnFee:       process.env.NEXT_PUBLIC_RETURN_FEE       || "FreeReturn",
    returnMethod:    process.env.NEXT_PUBLIC_RETURN_METHOD    || "ReturnByMail",
  },
};

export default storeConfig;