import type { Metadata } from "next";
import CheckoutAlternativePageView from "pages-sections/checkout-alternative/page-view";

export const metadata: Metadata = {
  title: "Checkout Alternative - Prestige Apparel Group",
  description:
    "Shop luxury designer bags and fashion at Prestige Apparel Group. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default function CheckoutAlternative() {
  return <CheckoutAlternativePageView />;
}

