// src/app/return-policy/page.tsx
import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Refund Policy", "Our return and refund guidelines.");

export default async function ReturnPolicyPage() {
  const policy = await loadPolicy("refund_policy");
  return <PolicyPage policy={policy} />;
}
