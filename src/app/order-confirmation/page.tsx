import type { Metadata } from "next";
import { OrderConfirmationPageView } from "pages-sections/order-confirmation";

export const metadata: Metadata = {
  title: "Order Confirmed — Prestige Apparel Group",
  description: "Your order has been confirmed. Thank you for shopping with Prestige Apparel Group.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["order confirmation", "prestige apparel"]
};

export default function OrderConfirmation() {
  return <OrderConfirmationPageView />;
}
