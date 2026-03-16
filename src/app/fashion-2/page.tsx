import { Metadata } from "next";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";

export const metadata: Metadata = {
  title: "Prestige Apparel Group — Luxury Designer Bags & Fashion",
  description: "Your premier destination for luxury designer bags and fashion.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["luxury bags", "designer handbags", "fashion", "prestige apparel"],
};

export default async function FashionTwoPage() {
  return <FashionTwoPageView />;
}
