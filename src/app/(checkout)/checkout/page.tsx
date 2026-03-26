// src/app/(checkout)/checkout/page.tsx
"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Link from "next/link";
import useCart from "hooks/useCart";

export default function Checkout() {
  const { state } = useCart() as any;

  useEffect(() => {
    if (state?.checkoutUrl) {
      window.location.href = state.checkoutUrl;
    }
  }, [state?.checkoutUrl]);

  if (state?.checkoutUrl) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: 2 }}>
        <CircularProgress />
        <Typography variant="h6">Redirecting to secure checkout...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: 2 }}>
      <Typography variant="h6">Your cart is empty</Typography>
      <Link href="/" style={{ textDecoration: "none" }}>
        <Button variant="contained">Continue Shopping</Button>
      </Link>
    </Box>
  );
}
