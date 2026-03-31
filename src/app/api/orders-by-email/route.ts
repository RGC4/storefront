// src/app/api/orders-by-email/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const version = process.env.SHOPIFY_API_VERSION || "2026-01";

    if (!adminToken || !domain) {
      console.log(`[ORDERS BY EMAIL] Would look up orders for ${email}`);
      return NextResponse.json({ orders: [] });
    }

    const encodedEmail = encodeURIComponent(email);
    const res = await fetch(
      `https://${domain}/admin/api/${version}/orders.json?email=${encodedEmail}&status=any&fields=id,name,created_at,line_items,financial_status,fulfillment_status&limit=25`,
      {
        headers: {
          "X-Shopify-Access-Token": adminToken,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Shopify Admin API returned ${res.status}`);
    }

    const data = await res.json();
    const orders = (data.orders || []).map((o: any) => ({
      id: o.id,
      name: o.name,
      date: o.created_at,
      items: (o.line_items || []).map((li: any) => ({
        title: li.title,
        variantTitle: li.variant_title,
        quantity: li.quantity,
      })),
      status: o.fulfillment_status || "unfulfilled",
      financial: o.financial_status,
    }));

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("Orders by email error:", err);
    return NextResponse.json({ error: "Failed to look up orders." }, { status: 500 });
  }
}
