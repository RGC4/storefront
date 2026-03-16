// DESTINATION: src/app/api/order-lookup/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, email } = await req.json();

    if (!orderNumber || !email) {
      return NextResponse.json({ error: "Order number and email are required." }, { status: 400 });
    }

    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const version = process.env.SHOPIFY_API_VERSION || "2026-01";

    if (!adminToken || !domain) {
      // Dev fallback — mock response so UI is testable without credentials
      console.log(`[ORDER LOOKUP] Would look up order #${orderNumber} for ${email}`);
      return NextResponse.json({
        order: {
          id: "mock-001",
          name: `#${orderNumber}`,
          email,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          financialStatus: "paid",
          fulfillmentStatus: "unfulfilled",
          totalPrice: "149.99",
          currency: "CAD",
          lineItems: [
            { title: "Designer Handbag – Black", quantity: 1, price: "149.99", variantTitle: "One Size" },
          ],
          shippingAddress: {
            name: "Demo Customer",
            address1: "123 Main St",
            city: "Toronto",
            province: "ON",
            zip: "M5V 1A1",
            country: "Canada",
          },
          statusUrl: null,
        },
      });
    }

    // Real Shopify Admin REST lookup
    const query = encodeURIComponent(orderNumber.replace(/^#/, ""));
    const res = await fetch(
      `https://${domain}/admin/api/${version}/orders.json?name=${query}&status=any&fields=id,name,email,created_at,financial_status,fulfillment_status,total_price,currency,line_items,shipping_address,order_status_url`,
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
    const orders: any[] = data.orders || [];

    // Match by order name AND email (case-insensitive)
    const match = orders.find(
      (o) => o.email?.toLowerCase() === email.toLowerCase()
    );

    if (!match) {
      return NextResponse.json({ order: null }, { status: 200 });
    }

    return NextResponse.json({
      order: {
        id: match.id,
        name: match.name,
        email: match.email,
        createdAt: match.created_at,
        financialStatus: match.financial_status,
        fulfillmentStatus: match.fulfillment_status,
        totalPrice: match.total_price,
        currency: match.currency,
        lineItems: (match.line_items || []).map((li: any) => ({
          title: li.title,
          quantity: li.quantity,
          price: li.price,
          variantTitle: li.variant_title,
        })),
        shippingAddress: match.shipping_address || null,
        statusUrl: match.order_status_url || null,
      },
    });
  } catch (err: any) {
    console.error("Order lookup error:", err);
    return NextResponse.json({ error: "Failed to look up order." }, { status: 500 });
  }
}
