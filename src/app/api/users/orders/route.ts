// src/app/api/users/orders/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SHOP_ID = process.env.SHOPIFY_SHOP_ID!;

async function getShopifyOrders(accessToken: string) {
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
                  name
                  processedAt
                  fulfillments(first: 1) {
                    edges {
                      node {
                        status
                      }
                    }
                  }
                  totalPrice {
                    amount
                    currencyCode
                  }
                  lineItems(first: 20) {
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
                  }
                }
              }
            }
          }
        }`,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Shopify orders query failed: ${error}`);
  }

  return res.json();
}

function mapStatus(fulfillments: any[]): string {
  if (!fulfillments || fulfillments.length === 0) return "Processing";
  const status = fulfillments[0]?.node?.status;
  if (status === "SUCCESS") return "Delivered";
  if (status === "CANCELLED" || status === "FAILURE") return "Cancelled";
  if (status === "PENDING") return "Pending";
  return "Processing";
}

function mapOrders(shopifyData: any) {
  const edges = shopifyData?.data?.customer?.orders?.edges || [];

  return edges.map((edge: any) => {
    const node = edge.node;
    const items = (node.lineItems?.edges || []).map((li: any) => ({
      product_img: li.node.image?.url || "",
      product_name: li.node.title,
      product_price: parseFloat(li.node.price?.amount || "0"),
      product_quantity: li.node.quantity,
      variant: li.node.variantTitle || undefined,
    }));

    const fulfillmentEdges = node.fulfillments?.edges || [];
    const status = mapStatus(fulfillmentEdges);

    return {
      id: node.id.replace("gid://shopify/Order/", ""),
      name: node.name,
      status,
      createdAt: node.processedAt,
      deliveredAt: status === "Delivered" ? node.processedAt : null,
      isDelivered: status === "Delivered",
      totalPrice: parseFloat(node.totalPrice?.amount || "0"),
      tax: 0,
      discount: 0,
      items,
      shippingAddress: node.shippingAddress?.formatted?.join(", ") || "",
      user: { name: { firstName: "", lastName: "" }, email: "", avatar: "" },
    };
  });
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("shopify_session");

    if (!sessionCookie) {
      return NextResponse.json([], { status: 200 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { accessToken } = session;

    if (!accessToken) {
      return NextResponse.json([], { status: 200 });
    }

    const shopifyData = await getShopifyOrders(accessToken);
    const orders = mapOrders(shopifyData);

    return NextResponse.json(orders);
  } catch (err) {
    console.error("[api/users/orders] error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
