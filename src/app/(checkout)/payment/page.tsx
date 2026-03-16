import type { Metadata } from "next";
import { PaymentPageView } from "pages-sections/payment/page-view";

export const metadata: Metadata = {
  title: "Payment — Prestige Apparel Group",
  description: "Secure payment at Prestige Apparel Group.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["payment", "luxury bags", "designer handbags", "prestige apparel"]
};

export default function Payment() {
  return <PaymentPageView />;
}
