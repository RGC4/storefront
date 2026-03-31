import type { Metadata } from "next";
import { RegisterPageView } from "pages-sections/sessions/page-view";
import { storeMetadata } from "@/lib/storeResolver";

export const metadata: Metadata = storeMetadata("Create Account", "Create your account.");

export default function Register() {
  return <RegisterPageView />;
}
