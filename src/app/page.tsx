import { Metadata } from "next";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";

export const metadata: Metadata = {
  title: "Prestige Apparel Group — Luxury Designer Bags & Fashion",
  description: "Shop our curated collection of luxury designer bags, clutches, totes and more. Authentic brands at competitive prices.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["luxury bags", "designer handbags", "Valentino", "Chloé", "Saint Laurent", "fashion", "prestige apparel"]
};

export default function IndexPage() {
  return <FashionTwoPageView />;
}
