import type { Metadata } from "next";
import { LoginPageView } from "pages-sections/sessions/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export async function generateMetadata(): Promise<Metadata> {
  return storeMetadata("Login", "Sign in to your account.");
}

export default function Login() {
  return <LoginPageView />;
}
