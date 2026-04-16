import type { Metadata } from "next";
import { LoginPageView } from "pages-sections/sessions/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export const metadata: Metadata = storeMetadata("Login", "Sign in to your account.");

export default function Login() {
  return <LoginPageView />;
}
