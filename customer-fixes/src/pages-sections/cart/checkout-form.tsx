"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import useCart from "hooks/useCart";
import { FlexBetween, FlexBox } from "components/flex-box";
import { currency } from "lib";

export default function CheckoutForm() {
  const { state } = useCart();
  const cart = state?.cart ?? [];

  const subtotal = cart.reduce((acc: number, item: any) => acc + item.price * item.qty, 0);
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (state.checkoutUrl) {
      window.location.href = state.checkoutUrl;
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        padding: { xs: 2, sm: 3 },
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        Order Summary
      </Typography>

      <FlexBetween mb={1}>
        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
        <Typography variant="body2" fontWeight={500}>{currency(subtotal)}</Typography>
      </FlexBetween>

      <FlexBetween mb={1}>
        <Typography variant="body2" color="text.secondary">Shipping</Typography>
        <Typography variant="body2" fontWeight={500} color={shipping === 0 ? "success.main" : "text.primary"}>
          {shipping === 0 ? "Free" : currency(shipping)}
        </Typography>
      </FlexBetween>

      {shipping > 0 && (
        <Box display="flex" alignItems="center" gap={0.5} mb={1}>
          <LocalShippingOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Add {currency(99 - subtotal)} more for free shipping
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <FlexBetween mb={3}>
        <Typography variant="body1" fontWeight={700}>Total</Typography>
        <Typography variant="h5" fontWeight={800}>{currency(total)}</Typography>
      </FlexBetween>

      {/* Promo code */}
      <FlexBox alignItems="center" gap={1} mb={2}>
        <TextField
          fullWidth
          size="small"
          label="Promo Code"
          variant="outlined"
          placeholder="Enter code"
        />
        <Button variant="outlined" color="primary" sx={{ whiteSpace: "nowrap" }}>
          Apply
        </Button>
      </FlexBox>

      <Divider sx={{ mb: 2 }} />

      <Button
        fullWidth
        size="large"
        color="primary"
        variant="contained"
        onClick={handleCheckout}
        disabled={!state.checkoutUrl || cart.length === 0}
        sx={{ py: 1.5 }}
      >
        Proceed to Checkout
      </Button>

      <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1.5}>
        Secure checkout powered by Shopify
      </Typography>
    </Card>
  );
}
