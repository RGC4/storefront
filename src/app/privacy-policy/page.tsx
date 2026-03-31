import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Privacy Policy", "How we collect, use, and protect your information.");

export default function PrivacyPolicyPage() {
  const policy = loadPolicy("privacy_policy");
  return <PolicyPage policy={policy} />;
}
