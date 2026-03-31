import type { Metadata } from "next";
import { OrderConfirmationPageView } from "pages-sections/order-confirmation";
import { storeMetadata } from "@/lib/storeResolver";

export const metadata: Metadata = storeMetadata("Order Confirmed", "Your order has been confirmed.");

export default function OrderConfirmation() {
  return <OrderConfirmationPageView />;
}
