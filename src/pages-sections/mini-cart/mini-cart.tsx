<<<<<<< HEAD
// DESTINATION: src/pages-sections/mini-cart/mini-cart.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import useCart from "hooks/useCart";

export default function MiniCart() {
  const { state, updateCartLine, removeCartLine } = useCart() as any;
  const router = useRouter();
  const items = state?.cart ?? [];

  const subtotal = parseFloat(
    items.reduce((total: number, item: any) => {
      const qty = Number(item?.qty ?? 1);
      const price = Number(item?.price ?? 0);
      return total + qty * price;
    }, 0).toFixed(2)
  );

  return (
    <Box
      sx={{
        width: 520,
        maxWidth: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
          Your Cart
        </Typography>
      </Box>

      <Divider />

      {items.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            px: 3,
          }}
        >
          <Typography sx={{ fontSize: 18, color: "text.secondary", mb: 2 }}>
            No products in the cart
          </Typography>

          <Link href="/fashion-2" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: 1,
                px: 3,
                height: 48,
                fontSize: 16,
              }}
              onClick={() => router.back()}
            >
              Continue Shopping
            </Button>
          </Link>
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {items.map((item: any) => (
              <Box key={item.lineId} sx={{ px: 2.5, py: 2.25 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* PRODUCT IMAGE */}
                  <Box
                    sx={{
                      width: 92,
                      height: 92,
                      flexShrink: 0,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#fff",
                    }}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  {/* PRODUCT INFO */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        lineHeight: 1.35,
                        mb: 0.75,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        mb: 1.25,
                      }}
                    >
                      ${Number(item.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>

                    {/* QUANTITY BUTTONS */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Button
                        component="button"
                        type="button"
                        variant="outlined"
                        size="small"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateCartLine(item.lineId, Math.max(1, Number(item.qty) - 1));
                        }}
                        sx={{
                          minWidth: 34,
                          width: 34,
                          height: 34,
                          p: 0,
                          fontSize: 18,
                          lineHeight: 1,
                        }}
                      >
                        -
                      </Button>

                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 700,
                          minWidth: 18,
                          textAlign: "center",
                        }}
                      >
                        {item.qty}
                      </Typography>

                      <Button
                        component="button"
                        type="button"
                        variant="outlined"
                        size="small"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateCartLine(item.lineId, Number(item.qty) + 1);
                        }}
                        sx={{
                          minWidth: 34,
                          width: 34,
                          height: 34,
                          p: 0,
                          fontSize: 18,
                          lineHeight: 1,
                        }}
                      >
                        +
                      </Button>
                    </Box>
                  </Box>

                  {/* TRASH BUTTON — red */}
                  <IconButton
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeCartLine(item.lineId);
                    }}
                    sx={{
                      alignSelf: "flex-start",
                      width: 38,
                      height: 38,
                      border: "1px solid #ffcccc",
                      borderRadius: 1,
                      color: "#e53935",
                      "&:hover": {
                        bgcolor: "#fff0f0",
                        borderColor: "#e53935",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Divider sx={{ mt: 2.25 }} />
              </Box>
            ))}
          </Box>

          {/* FOOTER */}
          <Box sx={{ p: 3, borderTop: "1px solid #eee" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.04em" }}>
                SUBTOTAL
              </Typography>

              <Typography sx={{ fontSize: 34, fontWeight: 900 }}>
                ${subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>

            <Link href="/checkout" style={{ textDecoration: "none" }}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mb: 1.5,
                  height: 56,
                  fontWeight: 800,
                  fontSize: 16,
                  textTransform: "none",
                  borderRadius: 0,
                }}
              >
                Checkout
              </Button>
            </Link>

            <Link href="/cart" style={{ textDecoration: "none" }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  height: 56,
                  fontWeight: 700,
                  fontSize: 16,
                  textTransform: "none",
                  borderRadius: 0,
                }}
              >
                View Full Cart
              </Button>
            </Link>
          </Box>
        </>
=======
import Link from "next/link";
import { useRouter } from "next/navigation";
// MUI
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Clear from "@mui/icons-material/Clear";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
// LOCAL CUSTOM COMPONENTS
import MiniCartItem from "./components/cart-item";
import EmptyCartView from "./components/empty-view";
// GLOBAL CUSTOM COMPONENT
import { FlexBetween } from "components/flex-box";
import OverlayScrollbar from "components/overlay-scrollbar";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// CUSTOM DATA MODEL
import { CartItem } from "contexts/CartContext";

export default function MiniCart() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const CART_LENGTH = state.cart.length;

  const handleCartAmountChange = (amount: number, product: CartItem) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...product, qty: amount }
    });
  };

  const getTotalPrice = () => {
    return state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  return (
    <Box height="100vh" width={380}>
      <FlexBetween ml={3} mr={2} height={74}>
        <Typography variant="h6">Your Cart ({CART_LENGTH})</Typography>

        <IconButton size="small" onClick={router.back}>
          <Clear fontSize="small" />
        </IconButton>
      </FlexBetween>

      <Divider />

      <Box height={`calc(100% - ${CART_LENGTH ? "211px" : "75px"})`}>
        {CART_LENGTH > 0 ? (
          <OverlayScrollbar>
            {state.cart.map((item) => (
              <MiniCartItem item={item} key={item.id} onCart={handleCartAmountChange} />
            ))}
          </OverlayScrollbar>
        ) : (
          <EmptyCartView />
        )}
      </Box>

      {CART_LENGTH > 0 && (
        <Box p={2.5}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            LinkComponent={Link}
            href="/checkout-alternative"
            sx={{ height: 44, mb: 1 }}
          >
            Proceed to Checkout
          </Button>

          <Button
            fullWidth
            color="primary"
            variant="outlined"
            LinkComponent={Link}
            href="/cart"
            sx={{ height: 44 }}
          >
            View Cart
          </Button>
        </Box>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      )}
    </Box>
  );
}
