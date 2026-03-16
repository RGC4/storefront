import type { Metadata } from "next";
import { LoginPageView } from "pages-sections/sessions/page-view";

export const metadata: Metadata = {
  title: "Login — Prestige Apparel Group",
  description: "Sign in to your Prestige Apparel Group account.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["login", "sign in", "prestige apparel"]
};

export default function Login() {
  return <LoginPageView />;
}
