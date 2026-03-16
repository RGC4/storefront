import { NextRequest, NextResponse } from "next/server";
import {
  shopifyCreateCart,
  shopifyAddToCart,
  shopifyUpdateCartLine,
  shopifyRemoveCartLine,
  shopifyGetCart,
} from "lib/shopify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, cartId, merchandiseId, quantity, lineId } = body;

    switch (action) {
      case "create": {
        const cart = await shopifyCreateCart();
        return NextResponse.json(cart);
      }
      case "add": {
        const cart = await shopifyAddToCart(cartId, merchandiseId, quantity ?? 1);
        return NextResponse.json(cart);
      }
      case "update": {
        const cart = await shopifyUpdateCartLine(cartId, lineId, quantity);
        return NextResponse.json(cart);
      }
      case "remove": {
        const cart = await shopifyRemoveCartLine(cartId, lineId);
        return NextResponse.json(cart);
      }
      case "get": {
        const cart = await shopifyGetCart(cartId);
        return NextResponse.json(cart);
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Cart API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
