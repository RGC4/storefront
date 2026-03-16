import type { Metadata } from "next";
import { CartPageView } from "pages-sections/cart/page-view";

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Cart — Prestige Apparel Group",
  description: "Review your cart and proceed to checkout at Prestige Apparel Group.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["luxury bags", "designer handbags", "fashion", "prestige apparel"]
=======
  title: "Cart - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
};

export default function Cart() {
  return <CartPageView />;
}
