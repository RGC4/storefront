// DESTINATION: src/app/order-lookup/page.tsx
import type { Metadata } from "next";
import OrderLookupPageView from "pages-sections/order-lookup/page-view";

export const metadata: Metadata = {
  title: "Track Your Order — Prestige Apparel Group",
  description: "Enter your order number and email to check the status of your order.",
};

export default function OrderLookupPage() {
  return <OrderLookupPageView />;
}
