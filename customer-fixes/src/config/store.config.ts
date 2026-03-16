// ============================================================
// STORE CONFIGURATION
// Single source of truth — update these values or set via .env
// ============================================================

const storeConfig = {
  // Store identity
  name:         process.env.NEXT_PUBLIC_STORE_NAME        || "Prestige Apparel Group",
  email:        process.env.NEXT_PUBLIC_STORE_EMAIL       || "info@prestigeapparelgroup.com",
  phone:        process.env.NEXT_PUBLIC_STORE_PHONE       || "+1 (800) 123-4567",
  address:      process.env.NEXT_PUBLIC_STORE_ADDRESS     || "123 Fashion Ave, Toronto, ON M5V 1A1, Canada",

  // Shopify connection
  shopifyDomain:    process.env.SHOPIFY_STORE_DOMAIN                  || "",
  storefrontToken:  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN       || "",
  apiVersion:       process.env.SHOPIFY_API_VERSION                   || "2026-01",

  // Branding
  primaryColor:   process.env.NEXT_PUBLIC_PRIMARY_COLOR   || "#D23F57",
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#2B3445",
  logo:           process.env.NEXT_PUBLIC_LOGO_URL        || "/assets/stores/s1/logo/logo-1.png",

  // Hero section
  storeId:          process.env.NEXT_PUBLIC_STORE_ID           || "s1",
  heroTitle:        process.env.NEXT_PUBLIC_HERO_TITLE         || "New Collection",
  heroSubtitle:     process.env.NEXT_PUBLIC_HERO_SUBTITLE      || "Free shipping on orders over $99",
  heroButtonText:   process.env.NEXT_PUBLIC_HERO_BUTTON_TEXT   || "Shop Now",
  heroButtonLink:   process.env.NEXT_PUBLIC_HERO_BUTTON_LINK   || "/collections",

  // Footer
  footerDescription: process.env.NEXT_PUBLIC_FOOTER_DESCRIPTION ||
    "Your destination for luxury designer bags and fashion. Authentic brands, competitive prices, and exceptional service.",

  social: {
    facebook:  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK  || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    twitter:   process.env.NEXT_PUBLIC_SOCIAL_TWITTER   || "",
    youtube:   process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE   || "",
    google:    "",
  },
};

export default storeConfig;
