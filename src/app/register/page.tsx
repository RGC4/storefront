import type { Metadata } from "next";
import { RegisterPageView } from "pages-sections/sessions/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export async function generateMetadata(): Promise<Metadata> {
  return storeMetadata("Create Account", "Create your account.");
}

export default function Register() {
  return <RegisterPageView />;
}
