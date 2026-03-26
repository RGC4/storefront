// src/app/api/users/order/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SHOP_ID = process.env.SHOPIFY_SHOP_ID!;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("shopify_session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { accessToken } = session;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const gid = `gid://shopify/Order/${id}`;

    const res = await fetch(
      `https://shopify.com/${SHOP_ID}/account/customer/api/2024-07/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({
          query: `query GetOrder($id: ID!) {
            order(id: $id) {
              id
              name
              processedAt
              cancelledAt
              fulfillments(first: 5) {
                edges {
                  node {
                    status
                    estimatedDeliveryAt
                    events(first: 10) {
                      edges {
                        node {
                          happenedAt
                          status
                        }
                      }
                    }
                  }
                }
              }
              totalPrice {
                amount
                currencyCode
              }
              totalTax {
                amount
              }
              totalShipping {
                amount
              }
              discountApplications(first: 5) {
                edges {
                  node {
                    value {
                      ... on MoneyV2 {
                        amount
                      }
                      ... on PricingPercentageValue {
                        percentage
                      }
                    }
                  }
                }
              }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    image {
                      url
                    }
                    price {
                      amount
                    }
                    variantTitle
                  }
                }
              }
              shippingAddress {
                formatted
                address1
                address2
                city
                provinceCode
                zip
                country
              }
            }
          }`,
          variables: { id: gid },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("[api/users/order] Shopify error:", error);
      return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }

    const data = await res.json();
    const node = data?.data?.order;

    if (!node) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const fulfillmentEdges = node.fulfillments?.edges || [];
    let status = "Processing";
    if (node.cancelledAt) {
      status = "Cancelled";
    } else if (fulfillmentEdges.length > 0) {
      const fStatus = fulfillmentEdges[0]?.node?.status;
      if (fStatus === "SUCCESS") status = "Delivered";
      else if (fStatus === "PENDING") status = "Pending";
    }

    const items = (node.lineItems?.edges || []).map((li: any) => ({
      product_img: li.node.image?.url || "",
      product_name: li.node.title,
      product_price: parseFloat(li.node.price?.amount || "0"),
      product_quantity: li.node.quantity,
      variant: li.node.variantTitle || undefined,
    }));

    const order = {
      id: node.id.replace("gid://shopify/Order/", ""),
      name: node.name,
      status,
      createdAt: node.processedAt,
      deliveredAt: status === "Delivered" ? node.processedAt : null,
      isDelivered: status === "Delivered",
      totalPrice: parseFloat(node.totalPrice?.amount || "0"),
      tax: parseFloat(node.totalTax?.amount || "0"),
      discount: 0,
      items,
      shippingAddress: node.shippingAddress?.formatted?.join(", ") || "",
      user: { name: { firstName: "", lastName: "" }, email: "", avatar: "" },
    };

    return NextResponse.json(order);
  } catch (err) {
    console.error("[api/users/order] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
