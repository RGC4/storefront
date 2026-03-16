<<<<<<< HEAD
// DESTINATION: src/contexts/CartContext.tsx
=======
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
<<<<<<< HEAD
  useEffect,
  useRef,
  useState,
} from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CartLine {
  lineId: string;
  variantId: string;
  id: string;
=======
  useContext,
  useEffect,
  useState,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CartLine {
  lineId: string;       // Shopify cart line ID  (used for update/remove)
  variantId: string;    // gid://shopify/ProductVariant/...
  id: string;           // same as variantId — kept for legacy compatibility
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
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
<<<<<<< HEAD
  cartList: CartLine[];
  checkoutUrl: string | null;
  dispatch: (args: { type: "CHANGE_CART_AMOUNT" | "CLEAR_CART"; payload?: CartLine }) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
=======
  /** Legacy dispatch shim — use addToCart/updateCartLine/removeCartLine instead */
  dispatch: (args: { type: "CHANGE_CART_AMOUNT" | "CLEAR_CART"; payload?: CartLine }) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b

const CART_ID_KEY = "shopify_cart_id";

function mapLines(rawCart: any): CartLine[] {
  if (!rawCart?.lines?.edges) return [];
<<<<<<< HEAD
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
=======
  return rawCart.lines.edges.map(({ node }: any) => ({
    lineId: node.id,
    variantId: node.merchandise.id,
    id: node.merchandise.id,
    qty: node.quantity,
    title: node.merchandise.product.title,
    slug: node.merchandise.product.handle,
    price: parseFloat(node.merchandise.price.amount),
    currency: node.merchandise.price.currencyCode,
    thumbnail: node.merchandise.product.images.edges[0]?.node.url ?? "",
  }));
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
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

<<<<<<< HEAD
// ── Context ──────────────────────────────────────────────────────────────────
=======
// ── Context ────────────────────────────────────────────────────────────────────
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b

export const CartContext = createContext<CartContextProps>({} as CartContextProps);

export default function CartProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<CartState>({
    cartId: null,
    checkoutUrl: null,
    cart: [],
    loading: true,
  });

<<<<<<< HEAD
  // Use a ref so callbacks always have the current cartId without needing
  // to be recreated — this fixes the stale closure bug with +/- buttons
  const cartIdRef = useRef<string | null>(null);

  useEffect(() => {
    cartIdRef.current = state.cartId;
  }, [state.cartId]);

=======
  // On mount: rehydrate existing cart or create a new one
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  useEffect(() => {
    const init = async () => {
      const storedId = localStorage.getItem(CART_ID_KEY);
      try {
        if (storedId) {
          const rawCart = await callCartApi({ action: "get", cartId: storedId });
          if (rawCart?.id) {
<<<<<<< HEAD
            cartIdRef.current = rawCart.id;
=======
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
            setState({
              cartId: rawCart.id,
              checkoutUrl: rawCart.checkoutUrl,
              cart: mapLines(rawCart),
              loading: false,
            });
            return;
          }
        }
<<<<<<< HEAD
        const newCart = await callCartApi({ action: "create" });
        localStorage.setItem(CART_ID_KEY, newCart.id);
        cartIdRef.current = newCart.id;
=======
        // No stored cart or it expired — create fresh
        const newCart = await callCartApi({ action: "create" });
        localStorage.setItem(CART_ID_KEY, newCart.id);
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
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
<<<<<<< HEAD
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
=======
    if (!state.cartId) return;
    try {
      const rawCart = await callCartApi({
        action: "add",
        cartId: state.cartId,
        merchandiseId: variantId,
        quantity,
      });
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      setState((s) => ({
        ...s,
        checkoutUrl: rawCart.checkoutUrl,
        cart: mapLines(rawCart),
      }));
    } catch (err) {
      console.error("Add to cart error:", err);
    }
<<<<<<< HEAD
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
=======
  }, [state.cartId]);

  const updateCartLine = useCallback(async (lineId: string, quantity: number) => {
    if (!state.cartId) return;
    try {
      const rawCart = await callCartApi({
        action: "update",
        cartId: state.cartId,
        lineId,
        quantity,
      });
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      setState((s) => ({
        ...s,
        checkoutUrl: rawCart.checkoutUrl,
        cart: mapLines(rawCart),
      }));
    } catch (err) {
      console.error("Update cart error:", err);
    }
<<<<<<< HEAD
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
=======
  }, [state.cartId]);

  const removeCartLine = useCallback(async (lineId: string) => {
    if (!state.cartId) return;
    try {
      const rawCart = await callCartApi({
        action: "remove",
        cartId: state.cartId,
        lineId,
      });
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      setState((s) => ({
        ...s,
        checkoutUrl: rawCart.checkoutUrl,
        cart: mapLines(rawCart),
      }));
    } catch (err) {
      console.error("Remove cart error:", err);
    }
<<<<<<< HEAD
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY);
    cartIdRef.current = null;
    setState((s) => ({ ...s, cartId: null, checkoutUrl: null, cart: [] }));
    callCartApi({ action: "create" }).then((newCart) => {
      localStorage.setItem(CART_ID_KEY, newCart.id);
      cartIdRef.current = newCart.id;
=======
  }, [state.cartId]);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY);
    setState((s) => ({ ...s, cartId: null, checkoutUrl: null, cart: [] }));
    // Create a fresh cart in background
    callCartApi({ action: "create" }).then((newCart) => {
      localStorage.setItem(CART_ID_KEY, newCart.id);
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      setState((s) => ({ ...s, cartId: newCart.id, checkoutUrl: newCart.checkoutUrl }));
    });
  }, []);

<<<<<<< HEAD
=======
  // Legacy dispatch shim so existing components don't break
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
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
<<<<<<< HEAD
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
=======
    <CartContext value={{ state, addToCart, updateCartLine, removeCartLine, clearCart, dispatch }}>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      {children}
    </CartContext>
  );
}
