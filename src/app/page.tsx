// src/app/page.tsx
// FIXES: Uses template metadata system from layout.tsx

import { Metadata } from "next";
import ShopLayout1 from "components/layouts/shop-layout-1";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";
import api from "utils/__api__/layout";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Store";

export const metadata: Metadata = {
  title: `${STORE_NAME} — Luxury Designer Bags & Fashion`,
  description: `Shop our curated collection of luxury designer bags, clutches, totes and fashion at ${STORE_NAME}. Authentic brands at competitive prices. Free shipping available.`,
  keywords: [
    "luxury designer bags",
    "designer handbags",
    "authentic designer bags",
    "luxury fashion",
    "designer clutches",
    "designer totes",
    STORE_NAME,
  ],
};

export default async function IndexPage() {
  const data = await api.getLayoutData();
  return (
    <ShopLayout1 data={data}>
      <FashionTwoPageView />
    </ShopLayout1>
  );
}
