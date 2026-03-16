import { Metadata } from "next";
import { PaymentMethodsPageView } from "pages-sections/customer-dashboard/payment-methods/page-view";
import api from "utils/__api__/payments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Payment Methods - Prestige Apparel Group", description: "Manage payment methods." };

interface Props { searchParams: Promise<{ page: string }>; }

export default async function PaymentMethods({ searchParams }: Props) {
  const { page } = await searchParams;
  const data = await api.getPayments(+page || 1);
  if (!data || data.payments.length === 0) return <div>Data not found</div>;
  return <PaymentMethodsPageView payments={data.payments} totalPages={data.totalPages} />;
}
