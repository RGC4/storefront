import type { Metadata } from "next";
import CheckoutPageView from "pages-sections/checkout/page-view";

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Checkout — Prestige Apparel Group",
  description: "Complete your purchase at Prestige Apparel Group.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["checkout", "luxury bags", "designer handbags", "prestige apparel"]
=======
  title: "Checkout - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
};

export default function Checkout() {
  return <CheckoutPageView />;
}
