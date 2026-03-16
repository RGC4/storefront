import type { Metadata } from "next";
import { AddressPageView } from "pages-sections/customer-dashboard/address/page-view";
import api from "utils/__api__/address";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Address - Prestige Apparel Group", description: "Manage your addresses." };

interface Props { searchParams: Promise<{ page: string }>; }

export default async function Address({ searchParams }: Props) {
  const { page } = await searchParams;
  const data = await api.getAddressList(+page || 1);
  if (!data || data.addressList.length === 0) return <div>Data not found</div>;
  return <AddressPageView addresses={data.addressList} totalPages={data.totalPages} />;
}
