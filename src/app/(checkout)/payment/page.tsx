// src/app/(checkout)/payment/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Payment() {
  const router = useRouter();

  useEffect(() => {
    // Payment is handled by Shopify checkout — redirect to cart
    router.replace("/cart");
  }, [router]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: 2 }}>
      <Typography variant="h6">Payment is handled at checkout</Typography>
      <Link href="/cart" style={{ textDecoration: "none" }}>
        <Button variant="contained">Go to Cart</Button>
      </Link>
    </Box>
  );
}
