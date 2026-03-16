// Run this to upload the initial s1 store config directly to Vercel Blob
// Usage: npx tsx scripts/upload-store-config.ts

import { put } from "@vercel/blob";
import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });

const storeConfig = {
  storeId: "s1",
  name: "Prestige Apparel Group",
  email: "info@prestigeapparelgroup.com",
  phone: "",
  address: "",
  domain: "www.prestigeapparelgroup.com",
  logo: "/assets/stores/s1/logo/logo-header.png",
  logoHeader: "/assets/stores/s1/logo/logo-header.png",
  logoFooter: "/assets/stores/s1/logo/logo-footer.png",
  primaryColor: "#D23F57",
  secondaryColor: "#2B3445",
  heroTitle: "New Collection",
  heroSubtitle: "Free shipping on orders over $99",
  heroButtonText: "Shop Now",
  heroButtonLink: "/collections",
  footerDescription: "Your destination for luxury designer bags and fashion.",
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    google: "",
  },
};

async function uploadConfig() {
  console.log("Uploading s1 config to Vercel Blob...");
  
  const blob = await put(
    "stores/s1.json",
    JSON.stringify(storeConfig, null, 2),
    {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    }
  );

  console.log("Success! Config uploaded to:", blob.url);
}

uploadConfig().catch(console.error);
