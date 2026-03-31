import type { Metadata } from "next";
import AboutPageView from "pages-sections/about/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export async function generateMetadata(): Promise<Metadata> {
  return storeMetadata("About Us", "Learn more about us.");
}

export default function AboutPage() {
  return <AboutPageView />;
}
