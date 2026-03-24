// src/app/about/page.tsx
import type { Metadata } from "next";
import AboutPageView from "pages-sections/about/page-view";

export const metadata: Metadata = {
  title: "About Us â€” Prestige Apparel Group",
  description: "Learn about Prestige Apparel Group â€” premium Italian-crafted apparel and accessories, curated and delivered with care.",
};

export default function AboutPage() {
  return <AboutPageView />;
}
