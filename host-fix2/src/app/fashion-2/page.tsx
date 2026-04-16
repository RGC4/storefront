import type { Metadata } from "next";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export const metadata: Metadata = storeMetadata("Luxury Fashion", "Shop our curated collection.");

export default function FashionShopTwo() {
  return <FashionTwoPageView />;
}
