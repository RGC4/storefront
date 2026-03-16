// =====================================================// =====================================================
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
