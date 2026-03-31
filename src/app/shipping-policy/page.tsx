import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Shipping Policy", "Shipping rates, timelines, and delivery information.");

export default function ShippingPolicyPage() {
  const policy = loadPolicy("shipping_policy");
  return <PolicyPage policy={policy} />;
}
