import type { Metadata } from "next";
import { OrderConfirmationPageView } from "pages-sections/order-confirmation";
import { storeMetadata } from "@/lib/storeResolver";

export async function generateMetadata(): Promise<Metadata> {
  return storeMetadata("Order Confirmed", "Your order has been confirmed. Thank you for shopping with us.");
}

export default function OrderConfirmation() {
  return <OrderConfirmationPageView />;
}
