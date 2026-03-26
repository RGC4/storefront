// src/utils/__api__/orders.ts
import { cache } from "react";
import { cookies } from "next/headers";
import Order from "models/Order.model";
import { IdParams } from "models/Common";

const getBaseUrl = () => {
  return process.env.SHOPIFY_APP_URL || process.env.NEXT_PUBLIC_NGROK_URL || "http://localhost:3000";
};

const getOrders = cache(async (page = 1) => {
  const PAGE_SIZE = 5;
  const PAGE_NO = page - 1;

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  const res = await fetch(`${getBaseUrl()}/api/users/orders`, {
    headers: { Cookie: allCookies },
    cache: "no-store",
  });

  const orders: Order[] = res.ok ? await res.json() : [];

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const currentOrders = orders.slice(PAGE_NO * PAGE_SIZE, (PAGE_NO + 1) * PAGE_SIZE);

  return { orders: currentOrders, totalOrders: orders.length, totalPages };
});

const getIds = cache(async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  const res = await fetch(`${getBaseUrl()}/api/users/order-ids`, {
    headers: { Cookie: allCookies },
    cache: "no-store",
  });

  const data: IdParams[] = res.ok ? await res.json() : [];
  return data;
});

const getOrder = cache(async (id: string) => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  const res = await fetch(`${getBaseUrl()}/api/users/order?id=${id}`, {
    headers: { Cookie: allCookies },
    cache: "no-store",
  });

  const data: Order = res.ok ? await res.json() : null;
  return data;
});

export default { getOrders, getOrder, getIds };
