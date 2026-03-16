// DESTINATION: src/app/contact/page.tsx
import type { Metadata } from "next";
import ContactPageView from "pages-sections/contact/page-view";

export const metadata: Metadata = {
  title: "Contact Us — Prestige Apparel Group",
  description: "Get in touch with our customer support team. Submit a support ticket and we'll respond within 1–2 business days.",
};

export default function ContactPage() {
  return <ContactPageView />;
}
