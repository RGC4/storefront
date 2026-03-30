import type { Metadata } from "next";
import { notFound } from "next/navigation";
import api from "utils/__api__/shop";
import { ShopsPageView } from "pages-sections/shops/page-view";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Shops - Prestige Apparel Group",
  description: "Browse our shops.",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function Shops() {
  const { shops, meta } = await api.getShopList();
  if (!shops) return notFound();

  return (
    <ShopsPageView
      shops={shops}
      lastIndex={meta.lastIndex}
      totalPages={meta.totalPages}
      firstIndex={meta.firstIndex}
      totalShops={meta.totalShops}
    />
  );
}
