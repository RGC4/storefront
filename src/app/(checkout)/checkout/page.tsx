import type { Metadata } from "next";
import CheckoutPageView from "pages-sections/checkout/page-view";

export const metadata: Metadata = {
  title: "Checkout — Prestige Apparel Group",
  description: "Complete your purchase at Prestige Apparel Group.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["checkout", "luxury bags", "designer handbags", "prestige apparel"]
};

export default function Checkout() {
  return <CheckoutPageView />;
}
