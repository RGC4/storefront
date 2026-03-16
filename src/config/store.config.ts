// ============================================================
// STORE CONFIGURATION
<<<<<<< HEAD
// Single source of truth — update these values or set via .env
=======
// This file is the single source of truth for each storefront.
// Change these values per Vercel deployment via environment variables.
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
// ============================================================

const storeConfig = {
  // Store identity
<<<<<<< HEAD
  name:         process.env.NEXT_PUBLIC_STORE_NAME        || "Prestige Apparel Group",
  email:        process.env.NEXT_PUBLIC_STORE_EMAIL       || "info@prestigeapparelgroup.com",
  phone:        process.env.NEXT_PUBLIC_STORE_PHONE       || "+1 (630) 479-8118",
  address:      process.env.NEXT_PUBLIC_STORE_ADDRESS     || "1 East Erie St Suite 525-4419, Chicago, IL 60611",

  // Shopify connection
  shopifyDomain:    process.env.SHOPIFY_STORE_DOMAIN                  || "",
  storefrontToken:  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN       || "",
  apiVersion:       process.env.SHOPIFY_API_VERSION                   || "2026-01",
=======
  name:         process.env.NEXT_PUBLIC_STORE_NAME        || "RGC4",
  email:        process.env.NEXT_PUBLIC_STORE_EMAIL       || "hello@rgc4.com",
  phone:        process.env.NEXT_PUBLIC_STORE_PHONE       || "",
  address:      process.env.NEXT_PUBLIC_STORE_ADDRESS     || "",

  // Shopify connection
  shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN         || "",
  storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
  apiVersion:   process.env.SHOPIFY_API_VERSION           || "2026-01",
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b

  // Branding
  primaryColor:   process.env.NEXT_PUBLIC_PRIMARY_COLOR   || "#D23F57",
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#2B3445",
<<<<<<< HEAD
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

=======
  logo:           process.env.NEXT_PUBLIC_LOGO_URL        || "/assets/images/bazaar-black-sm.svg",

  // Hero section
  // Media lives in public/pictures/{storeId}/
  // If hero.mp4 exists it takes precedence over images
  // Otherwise hero-1.png, hero-2.png, hero-3.png slide as carousel
  storeId:        process.env.NEXT_PUBLIC_STORE_ID        || "s1",
  heroTitle:      process.env.NEXT_PUBLIC_HERO_TITLE      || "New Collection",
  heroSubtitle:   process.env.NEXT_PUBLIC_HERO_SUBTITLE   || "Free shipping on orders over $99",
  heroButtonText: process.env.NEXT_PUBLIC_HERO_BUTTON_TEXT || "Shop Now",
  heroButtonLink: process.env.NEXT_PUBLIC_HERO_BUTTON_LINK || "/collections",

  // Footer
  footerDescription: process.env.NEXT_PUBLIC_FOOTER_DESCRIPTION || "Your premier fashion destination.",
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  social: {
    facebook:  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK  || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    twitter:   process.env.NEXT_PUBLIC_SOCIAL_TWITTER   || "",
    youtube:   process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE   || "",
<<<<<<< HEAD
    google:    "",
=======
    google:    process.env.NEXT_PUBLIC_SOCIAL_GOOGLE    || "",
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  },
};

export default storeConfig;
