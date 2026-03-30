import type { Metadata } from "next";
import ShopsPageView from "pages-sections/shops/page-view";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

export const metadata: Metadata = {
  title: `Shops — ${storeName}`,
  description: `Browse our collections at ${storeName}.`,
  authors: [{ name: storeName }],
};

export default function Shops() {
  return <ShopsPageView />;
}
