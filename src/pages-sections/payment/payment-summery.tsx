"use client";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useCart from "hooks/useCart";
import { currency } from "lib";

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" py={0.75}>
      <Typography variant="body2" fontWeight={bold ? 700 : 400} color={bold ? "text.primary" : "text.secondary"}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={bold ? 700 : 500}>
        {value}
      </Typography>
    </Box>
  );
}

export default function PaymentSummary() {
  const { state } = useCart();
  const cart = state?.cart ?? [];

  const subtotal = cart.reduce((acc: number, item: any) => acc + item.price * item.qty, 0);
  // Shipping: free over $99, else $9.99
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50",
        padding: { sm: 3, xs: 2 },
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        Order Summary
      </Typography>

      <Row label="Subtotal" value={currency(subtotal)} />
      <Row label="Shipping" value={shipping === 0 ? "Free" : currency(shipping)} />

      <Divider sx={{ my: 1.5 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" fontWeight={700}>Total</Typography>
        <Typography variant="h5" fontWeight={800}>{currency(total)}</Typography>
      </Box>

      {shipping === 0 && (
        <Typography variant="caption" color="success.main" display="block" mt={1}>
          🎉 You qualify for free shipping!
        </Typography>
      )}
    </Card>
  );
}
