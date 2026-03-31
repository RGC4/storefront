import type { Metadata } from "next";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export async function generateMetadata(): Promise<Metadata> {
  return storeMetadata("Luxury Fashion", "Shop our curated collection of luxury designer bags and fashion.");
}

export default function FashionShopTwo() {
  return <FashionTwoPageView />;
}
