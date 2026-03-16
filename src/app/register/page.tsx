import type { Metadata } from "next";
import { RegisterPageView } from "pages-sections/sessions/page-view";

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Create Account — Prestige Apparel Group",
  description: "Create your Prestige Apparel Group account.",
  authors: [{ name: "Prestige Apparel Group" }],
  keywords: ["register", "create account", "prestige apparel"]
=======
  title: "Register - Bazaar Next.js E-commerce Template",
  description:
    "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
};

export default function Register() {
  return <RegisterPageView />;
}
