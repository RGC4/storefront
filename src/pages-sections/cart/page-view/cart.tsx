"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CartItem from "../cart-item";
import EmptyCart from "../empty-cart";
import CheckoutForm from "../checkout-form";
import useCart from "hooks/useCart";

export default function CartPageView() {
  const { cartList } = useCart();

  if (!cartList?.length) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: "1500px !important",
          mt: 6
        }}
      >
        <EmptyCart />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        maxWidth: "1500px !important",
        mt: 6
      }}
    >
      <Grid container spacing={4}>
        <Grid item lg={8} md={8} xs={12}>
          {cartList.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <CheckoutForm />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{ borderColor: "#000", color: "#000", "&:hover": { borderColor: "#000", backgroundColor: "#f5f5f5" } }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
