// DESTINATION: src/contexts/CartContext.tsx
"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CartLine {
  lineId: string;
  variantId: string;
  id: string;
  qty: number;
  title: string;
  slug: string;
  price: number;
  currency: string;
  thumbnail: string;
}

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  cart: CartLine[];
  loading: boolean;
}

interface CartContextProps {
  state: CartState;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeCartLine: (lineId: string) => Promise<void>;
  clearCart: () => void;
  cartList: CartLine[];
  checkoutUrl: string | null;
  dispatch: (args: { type: "CHANGE_CART_AMOUNT" | "CLEAR_CART"; payload?: CartLine }) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const CART_ID_KEY = "shopify_cart_id";

function mapLines(rawCart: any): CartLine[] {
  if (!rawCart?.lines?.edges) return [];
  return rawCart.lines.edges
    .map(({ node }: any) => ({
      lineId: node.id,
      variantId: node.merchandise.id,
      id: node.merchandise.id,
      qty: node.quantity,
      title: node.merchandise.product.title,
      slug: node.merchandise.product.handle,
      price: parseFloat(node.merchandise.price.amount),
      currency: node.merchandise.price.currencyCode,
      thumbnail: node.merchandise.product.images.edges[0]?.node.url ?? "",
    }))
    // FIX: filter out any lines Shopify returns with qty 0 — these are
    // inventory-rejected adds that should not appear in the cart UI
    .filter((line: CartLine) => line.qty > 0);
}

async function callCartApi(body: Record<string, unknown>) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Cart API call failed");
  return res.json();
}

// ── Context ──────────────────────────────────────────────────────────────────

export const CartContext = createContext<CartContextProps>({} as CartContextProps);

export default function CartProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<CartState>({
    cartId: null,
    checkoutUrl: null,
    cart: [],
    loading: true,
  });

  // Use a ref so callbacks always have the current cartId without needing
  // to be recreated — this fixes the stale closure bug with +/- buttons
  const cartIdRef = useRef<string | null>(null);

  useEffect(() => {
    cartIdRef.current = state.cartId;
  }, [state.cartId]);

  useEffect(() => {
    const init = async () => {
      const storedId = localStorage.getItem(CART_ID_KEY);
      try {
        if (storedId) {
          const rawCart = await callCartApi({ action: "get", cartId: storedId });
          if (rawCart?.id) {
            cartIdRef.current = rawCart.id;
            setState({
              cartId: rawCart.id,
              checkoutUrl: rawCart.checkoutUrl,
              cart: mapLines(rawCart),
              loading: false,
            });
            return;
          }
        }
        const newCart = await callCartApi({ action: "create" });
        localStorage.setItem(CART_ID_KEY, newCart.id);
        cartIdRef.current = newCart.id;
        setState({
          cartId: newCart.id,
          checkoutUrl: newCart.checkoutUrl,
          cart: [],
          loading: false,
        });
      } catch (err) {
        console.error("Cart init error:", err);
        setState((s) => ({ ...s, loading: false }));
      }
    };
    init();
  }, []);

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    const cartId = cartIdRef.current;
    if (!cartId) return;
    try {
      const rawCart = await callCartApi({
        action: "add",
        cartId,
        merchandiseId: variantId,
        quantity,
      });
      // FIX: only update state if Shopify returned a valid cart with an id.
      // If rawCart is undefined/null (Shopify rejected the add), preserve
      // existing cart state rather than wiping it with an empty array.
      if (!rawCart?.id) {
        console.error("Add to cart: Shopify returned no cart — item may be out of stock");
        return;
      }
      setState((s) => ({
        ...s,
        checkoutUrl: rawCart.checkoutUrl,
        cart: mapLines(rawCart),
      }));
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  }, []);

  const updateCartLine = useCallback(async (lineId: string, quantity: number) => {
    const cartId = cartIdRef.current;
    if (!cartId) return;
    try {
      const rawCart = await callCartApi({
        action: "update",
        cartId,
        lineId,
        quantity,
      });
      if (!rawCart?.id) return;
      setState((s) => ({
        ...s,
        checkoutUrl: rawCart.checkoutUrl,
        cart: mapLines(rawCart),
      }));
    } catch (err) {
      console.error("Update cart error:", err);
    }
  }, []);

  const removeCartLine = useCallback(async (lineId: string) => {
    const cartId = cartIdRef.current;
    if (!cartId) return;
    try {
      const rawCart = await callCartApi({
        action: "remove",
        cartId,
        lineId,
      });
      if (!rawCart?.id) return;
      setState((s) => ({
        ...s,
        checkoutUrl: rawCart.checkoutUrl,
        cart: mapLines(rawCart),
      }));
    } catch (err) {
      console.error("Remove cart error:", err);
    }
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY);
    cartIdRef.current = null;
    setState((s) => ({ ...s, cartId: null, checkoutUrl: null, cart: [] }));
    callCartApi({ action: "create" }).then((newCart) => {
      localStorage.setItem(CART_ID_KEY, newCart.id);
      cartIdRef.current = newCart.id;
      setState((s) => ({ ...s, cartId: newCart.id, checkoutUrl: newCart.checkoutUrl }));
    });
  }, []);

  const dispatch = useCallback(
    (args: { type: "CHANGE_CART_AMOUNT" | "CLEAR_CART"; payload?: CartLine }) => {
      if (args.type === "CLEAR_CART") {
        clearCart();
        return;
      }
      if (args.type === "CHANGE_CART_AMOUNT" && args.payload) {
        const { id: variantId, qty, lineId } = args.payload as any;
        if (qty < 1 && lineId) {
          removeCartLine(lineId);
        } else if (lineId) {
          updateCartLine(lineId, qty);
        } else {
          addToCart(variantId, qty);
        }
      }
    },
    [addToCart, updateCartLine, removeCartLine, clearCart]
  );

  return (
    <CartContext value={{
      state,
      addToCart,
      updateCartLine,
      removeCartLine,
      clearCart,
      dispatch,
      cartList: state.cart,
      checkoutUrl: state.checkoutUrl,
    }}>
      {children}
    </CartContext>
  );
}
