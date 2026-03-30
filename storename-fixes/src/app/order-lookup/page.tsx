import type { Metadata } from "next";
import OrderLookupPageView from "pages-sections/order-lookup/page-view";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

export const metadata: Metadata = {
  title: `Track Your Order — ${storeName}`,
  description: `Track your order status at ${storeName}.`,
  authors: [{ name: storeName }],
};

export default function OrderLookup() {
  return <OrderLookupPageView />;
}
