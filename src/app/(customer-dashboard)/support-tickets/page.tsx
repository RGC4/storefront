<<<<<<< HEAD
import { Metadata } from "next";
=======
﻿import { Metadata } from "next";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import { TicketsPageView } from "pages-sections/customer-dashboard/support-tickets/page-view";
import api from "utils/__api__/ticket";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Support Tickets - Prestige Apparel Group", description: "View support tickets." };

interface Props { searchParams: Promise<{ page: string }>; }

export default async function SupportTickets({ searchParams }: Props) {
  const { page } = await searchParams;
  const data = await api.getTicketList(+page || 1);
  if (!data || data.tickets.length === 0) return <div>Data not found</div>;
  return <TicketsPageView tickets={data.tickets} totalPages={data.totalPages} />;
}
