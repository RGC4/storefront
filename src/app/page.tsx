import { Metadata } from "next";
import FashionTwoPageView from "pages-sections/fashion-2/page-view";

export const metadata: Metadata = {
  title: "Prestige Apparel Group — Luxury Designer Bags & Fashion",
  description: "Your premier destination for luxury designer bags and fashion.",
};

export default async function HomePage() {
  return <FashionTwoPageView />;
}
