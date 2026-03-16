// Run this once to upload the initial s1 store config to Vercel Blob
// Usage: npx tsx scripts/upload-store-config.ts

const config = {
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
  const res = await fetch("http://localhost:3000/api/admin/store-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storeId: "s1", config }),
  });

  const data = await res.json();
  console.log("Uploaded:", data);
}

uploadConfig();
