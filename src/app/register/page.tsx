import type { Metadata } from "next";
import { RegisterPageView } from "pages-sections/sessions/page-view";

export const metadata: Metadata = {
  title: "Create Account — Prestige Apparel Group",
  description: "Create your Prestige Apparel Group account.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["register", "create account", "prestige apparel"]
};

export default function Register() {
  return <RegisterPageView />;
}
