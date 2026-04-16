// src/app/terms/page.tsx
import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Terms and Conditions", "Terms and conditions for using our store.");

export default async function TermsPage() {
  const policy = await loadPolicy("terms_conditions");
  return <PolicyPage policy={policy} />;
}
