import { Metadata } from "next";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

export const metadata: Metadata = {
  title: `${storeName} — Luxury Designer Bags & Fashion`,
  description: `Shop ${storeName}'s curated collection of luxury designer bags, clutches, totes and more. Authentic brands at competitive prices.`,
  authors: [{ name: storeName }],
  keywords: ["luxury bags", "designer handbags", "Valentino", "Chloé", "Saint Laurent", "fashion", storeName.toLowerCase()],
};

export default function FashionShopTwo() {
  return <FashionTwoPageView />;
}
