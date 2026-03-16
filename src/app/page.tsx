import { Metadata } from "next";
import ShopLayout1 from "components/layouts/shop-layout-1";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";
import api from "utils/__api__/layout";

export const metadata: Metadata = {
  title: "Prestige Apparel Group — Luxury Designer Bags & Fashion",
  description: "Shop our curated collection of luxury designer bags, clutches, totes and more. Authentic brands at competitive prices.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["luxury bags", "designer handbags", "Valentino", "Chloé", "Saint Laurent", "fashion", "prestige apparel"]
};

export default async function IndexPage() {
  const data = await api.getLayoutData();
  return (
    <ShopLayout1 data={data}>
      <FashionTwoPageView />
    </ShopLayout1>
  );
}
