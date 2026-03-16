"use client";

<<<<<<< HEAD
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
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
      </Grid>
    </Container>
=======
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
// CUSTOM COMPONENTS
import Trash from "icons/Trash";
import CartItem from "../cart-item";
import EmptyCart from "../empty-cart";
import CheckoutForm from "../checkout-form";

export default function CartPageView() {
  const { state, dispatch } = useCart();

  if (state.cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ md: 8, xs: 12 }}>
        {state.cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        <Box textAlign="end">
          <Button
            disableElevation
            color="error"
            variant="outlined"
            startIcon={<Trash fontSize="small" />}
            onClick={() => dispatch({ type: "CLEAR_CART" })}
          >
            Clear Cart
          </Button>
        </Box>
      </Grid>

      <Grid size={{ md: 4, xs: 12 }}>
        <CheckoutForm />
      </Grid>
    </Grid>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  );
}
