// scripts/seed-store.ts
// ============================================================
// Run this once to create the s1 store config in Vercel Blob
// Usage: npx tsx scripts/seed-store.ts
// Requires BLOB_READ_WRITE_TOKEN in your .env.local
// ============================================================

import { put } from "@vercel/blob";
import type { StoreConfig } from "../src/lib/storeSchema";

const s1Config: StoreConfig = {
  storeId: "s1",
  storeName: "Prestige Apparel Group",
  storeUrl: "https://prestigeapparelgroup.com",
  tagline: "YOUR ONLINE BOUTIQUE",
  favicon: "/favicon.ico",

  email: "info@prestigeapparelgroup.com",
  phone: "+1 (630) 479-8118",
  address: "1 East Erie St Suite 525-4419, Chicago, IL 60611",

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
      headline: "Moments That Deserve to Be Noticed.",
      subheadline: "Luxury That Belongs in the Spotlight.",
    },
    {
      videoUrl: "/assets/stores/s1/videos/hero-2.mp4",
      posterUrl: "/assets/stores/s1/images/hero-2.jpg",
      headline: "Friends. Laughter. Timeless Style.",
      subheadline: "Unforgettable moments.",
    },
    {
      videoUrl: "/assets/stores/s1/videos/hero-3.mp4",
      posterUrl: "/assets/stores/s1/images/hero-3.jpg",
      headline: "Genuine Italian Leather. Exceptional Craftsmanship.",
      subheadline: "Exceptional service on every order, every time.",
    },
  ],

  heroTagline: "LUXURY HANDBAGS DIRECT FROM ITALY",
  heroButtonText: "Shop Now",
  heroButtonLink: "/collections",

  serviceCards: [
    { icon: "Truck",    title: "Free Delivery",      description: "On all orders" },
    { icon: "Payment",  title: "Secure Payment",     description: "Safe & protected" },
    { icon: "Verified", title: "Authentic Products", description: "100% guaranteed" },
    { icon: "Support",  title: "Human Support",      description: "To serve you" },
  ],

  footerDescription: "Your destination for luxury designer bags and fashion. Authentic brands, competitive prices, and exceptional service.",

  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
  },

  googleAnalyticsId: "",
  shopifyCollectionHandle: "s1",

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function seed() {
  console.log("Seeding store config for s1...");

  await put("stores/s1/config.json", JSON.stringify(s1Config, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });

  console.log("Done! Store s1 config written to Vercel Blob.");
}

seed().catch(console.error);
