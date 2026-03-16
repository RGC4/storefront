<<<<<<< HEAD
import type { Metadata } from "next";
=======
﻿import type { Metadata } from "next";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import { OrdersPageView } from "pages-sections/customer-dashboard/orders/page-view";
import api from "utils/__api__/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Orders - Prestige Apparel Group", description: "View your orders." };

interface Props { searchParams: Promise<{ page: string }>; }

export default async function Orders({ searchParams }: Props) {
  const { page } = await searchParams;
  const data = await api.getOrders(+page || 1);
  if (!data || data.orders.length === 0) return <div>Failed to load</div>;
  return <OrdersPageView orders={data.orders} totalPages={data.totalPages} />;
}
