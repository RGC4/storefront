// src/app/shipping-policy/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Shipping Policy", "Shipping rates, timelines, and delivery information.");

export default async function ShippingPolicyPage() {
  const policy = await loadPolicy("shipping_policy");
  return <PolicyPage policy={policy} />;
}
