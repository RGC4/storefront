import type { Metadata } from "next";
import { CartPageView } from "pages-sections/cart/page-view";

export const metadata: Metadata = {
  title: "Cart — Prestige Apparel Group",
  description: "Review your cart and proceed to checkout at Prestige Apparel Group.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["luxury bags", "designer handbags", "fashion", "prestige apparel"]
};

export default function Cart() {
  return <CartPageView />;
}
