import type { Metadata } from "next";
import { CartPageView } from "pages-sections/cart/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export const metadata: Metadata = storeMetadata("Cart", "Review your cart and proceed to checkout.");

export default function Cart() {
  return <CartPageView />;
}
