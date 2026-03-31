import type { Metadata } from "next";
import ContactPageView from "pages-sections/contact/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export const metadata: Metadata = storeMetadata("Contact Us", "Get in touch with our customer support team.");

export default function ContactPage() {
  return <ContactPageView />;
}
