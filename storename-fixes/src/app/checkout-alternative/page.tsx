import type { Metadata } from "next";
import CheckoutAltPageView from "pages-sections/checkout-alternative/page-view";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

export const metadata: Metadata = {
  title: `Checkout — ${storeName}`,
  description: `Complete your purchase at ${storeName}.`,
  authors: [{ name: storeName }],
};

export default function CheckoutAlternative() {
  return <CheckoutAltPageView />;
}
