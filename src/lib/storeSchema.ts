// src/lib/storeSchema.ts
// ============================================================
// STORE CONFIG SCHEMA
// This is the single source of truth for what a store looks like.
// All values are stored in Vercel Blob keyed by storeId.
// Shopify credentials stay in env vars — never in the blob.
// ============================================================

export type HeroSlide = {
  videoUrl: string;       // e.g. /assets/stores/s1/videos/hero-1.mp4
  posterUrl: string;      // fallback image for mobile
  headline: string;       // bold text on the slide
  subheadline: string;    // smaller text below headline
};

export type ServiceCard = {
  icon: string;           // icon name from appIcons e.g. "Truck"
  title: string;          // e.g. "Free Delivery"
  description: string;    // e.g. "On all orders"
};

export type SocialLinks = {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
};

export type LogoSet = {
  header: string;         // logo shown in desktop header
  headerMobile: string;   // logo shown in mobile header
  footer: string;         // logo shown in footer
  footerMobile: string;   // logo shown in mobile footer
};

export type StoreConfig = {
  // ── Identity ──────────────────────────────────────────────
  storeId: string;        // URL segment e.g. "s1"
  storeName: string;      // e.g. "Prestige Apparel Group"
  storeUrl: string;       // e.g. "https://prestigeapparelgroup.com"
  tagline: string;        // e.g. "LUXURY HANDBAGS DIRECT FROM ITALY"
  favicon: string;        // path to favicon

  // ── Contact ───────────────────────────────────────────────
  email: string;
  phone: string;
  address: string;

  // ── Branding ──────────────────────────────────────────────
  logo: LogoSet;
  primaryColor: string;   // e.g. "#D23F57"
  secondaryColor: string; // e.g. "#2B3445"

  // ── Hero Section ──────────────────────────────────────────
  heroSlides: HeroSlide[];
  heroTagline: string;    // small all-caps text over videos e.g. "LUXURY HANDBAGS DIRECT FROM ITALY"
  heroButtonText: string; // e.g. "Shop Now"
  heroButtonLink: string; // e.g. "/collections"

  // ── Service Cards (below hero) ────────────────────────────
  serviceCards: ServiceCard[];

  // ── Footer ────────────────────────────────────────────────
  footerDescription: string;

  // ── Social ────────────────────────────────────────────────
  social: SocialLinks;

  // ── Analytics ─────────────────────────────────────────────
  googleAnalyticsId: string;

  // ── Shopify Catalog Filter ────────────────────────────────
  // Products tagged with this value will show for this store
  shopifyCollectionHandle: string; // e.g. "s1" or "prestige-bags"

  // ── Meta ──────────────────────────────────────────────────
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
};

// ── Default / fallback store config ───────────────────────────
// Used as a base when creating a new store
export const defaultStoreConfig: Omit<StoreConfig, "storeId" | "storeName" | "storeUrl" | "createdAt" | "updatedAt"> = {
  tagline: "",
  favicon: "/favicon.ico",
  email: "",
  phone: "",
  address: "",
  logo: {
    header: "/assets/stores/s1/logo/logo-header.png",
    headerMobile: "/assets/stores/s1/logo/logo-header-mobile.png",
    footer: "/assets/stores/s1/logo/logo-footer.png",
    footerMobile: "/assets/stores/s1/logo/logo-footer-mobile.png",
  },
  primaryColor: "#D23F57",
  secondaryColor: "#2B3445",
  heroSlides: [
    {
      videoUrl: "/assets/stores/s1/videos/hero-1.mp4",
      posterUrl: "/assets/stores/s1/images/hero-1.jpg",
      headline: "New Collection",
      subheadline: "Free shipping on orders over $99",
    },
  ],
  heroTagline: "",
  heroButtonText: "Shop Now",
  heroButtonLink: "/collections",
  serviceCards: [
    { icon: "Truck",    title: "Free Delivery",      description: "On all orders" },
    { icon: "Payment",  title: "Secure Payment",     description: "Safe & protected" },
    { icon: "Verified", title: "Authentic Products", description: "100% guaranteed" },
    { icon: "Support",  title: "Human Support",      description: "To serve you" },
  ],
  footerDescription: "Your destination for luxury designer bags and fashion.",
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
  },
  googleAnalyticsId: "",
  shopifyCollectionHandle: "",
};
