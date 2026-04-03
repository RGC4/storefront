import { Metadata } from "next";
import ShopLayout1 from "components/layouts/shop-layout-1";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";
import api from "utils/__api__/layout";
import { storeMetadata } from "@/lib/storeResolver";

export const metadata: Metadata = storeMetadata(
  process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group",
  "Shop our curated collection of luxury designer bags and fashion."
);

export default async function IndexPage() {
  const data = await api.getLayoutData();
  return (
    <ShopLayout1 data={data}>
      <FashionTwoPageView />
    </ShopLayout1>
  );
}
