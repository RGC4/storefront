import type { Metadata } from "next";
import ReturnsPageView from "pages-sections/returns/page-view";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

export const metadata: Metadata = {
  title: `Returns & Exchanges — ${storeName}`,
  description: `View our returns and exchanges policy at ${storeName}.`,
  authors: [{ name: storeName }],
};

export default function Returns() {
  return <ReturnsPageView />;
}
