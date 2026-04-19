// src/app/privacy-policy/page.tsx

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Privacy Policy", "How we collect, use, and protect your information.");

export default async function PrivacyPolicyPage() {
  const policy = await loadPolicy("privacy_policy");
  return <PolicyPage policy={policy} />;
}

