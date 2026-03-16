// DESTINATION: src/app/returns/page.tsx
import type { Metadata } from "next";
import ReturnsPageView from "pages-sections/returns/page-view";

export const metadata: Metadata = {
  title: "Returns & Exchanges — Prestige Apparel Group",
  description: "Start a return or exchange. We accept returns within 30 days of delivery.",
};

export default function ReturnsPage() {
  return <ReturnsPageView />;
}
