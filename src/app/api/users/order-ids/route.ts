// src/app/api/users/order-ids/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SHOP_ID = process.env.SHOPIFY_SHOP_ID!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("shopify_session");

    if (!sessionCookie) {
      return NextResponse.json([]);
    }

    const session = JSON.parse(sessionCookie.value);
    const { accessToken } = session;

    if (!accessToken) {
      return NextResponse.json([]);
    }

    const res = await fetch(
      `https://shopify.com/${SHOP_ID}/account/customer/api/2024-07/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({
          query: `{
            customer {
              orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }`,
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data = await res.json();
    const edges = data?.data?.customer?.orders?.edges || [];
    const ids = edges.map((edge: any) => ({
      params: { id: edge.node.id.replace("gid://shopify/Order/", "") },
    }));

    return NextResponse.json(ids);
  } catch (err) {
    console.error("[api/users/order-ids] error:", err);
    return NextResponse.json([]);
  }
}
