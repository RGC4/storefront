"use client";

import { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useCart from "hooks/useCart";

export default function CheckoutPage() {
  const { state, checkoutUrl } = useCart() as any;
  const cart = state?.cart ?? [];

  const subtotal = cart.reduce((total: number, item: any) => {
    const qty = Number(item?.qty ?? 1);
    const price = Number(item?.price ?? 0);
    return total + qty * price;
  }, 0);

  const [form, setForm] = useState<any>({});

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: "0 auto",
        // FIX 1: responsive padding — desktop unchanged, mobile gets smaller padding
        padding: { xs: "24px 16px", md: "60px 30px" }
      }}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE */}
        <Grid item md={8} xs={12}>
          {/* FIX 2: card padding responsive */}
          <Card sx={{ padding: { xs: "20px 16px", md: "40px" }, mb: 4 }}>
            <Typography sx={{ fontSize: 28, fontWeight: 700, mb: 3 }}>
              Shipping Address
            </Typography>

            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField name="name" label="Full Name" fullWidth size="medium" onChange={handleChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="phone" label="Phone Number" fullWidth size="medium" onChange={handleChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="email" label="Email Address" fullWidth size="medium" onChange={handleChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="company" label="Company" fullWidth size="medium" onChange={handleChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="address1" label="Address 1" fullWidth size="medium" onChange={handleChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="address2" label="Address 2" fullWidth size="medium" onChange={handleChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="country" label="Country" fullWidth size="medium" onChange={handleChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="zip" label="Zip Code" fullWidth size="medium" onChange={handleChange} />
              </Grid>
            </Grid>
          </Card>

          {/* FIX 2: card padding responsive */}
          <Card sx={{ padding: { xs: "20px 16px", md: "40px" } }}>
            <Typography sx={{ fontSize: 28, fontWeight: 700, mb: 3 }}>
              Billing Address
            </Typography>

            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField label="Full Name" fullWidth size="medium" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField label="Phone Number" fullWidth size="medium" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField label="Email Address" fullWidth size="medium" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField label="Company" fullWidth size="medium" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField label="Address 1" fullWidth size="medium" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField label="Address 2" fullWidth size="medium" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField label="Country" fullWidth size="medium" />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField label="Zip Code" fullWidth size="medium" />
              </Grid>
            </Grid>
          </Card>

          {/* FIX 3: buttons stack vertically on mobile, side-by-side on desktop */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              gap: 2,
              mt: 4
            }}
          >
            <Button
              variant="outlined"
              fullWidth
              sx={{ height: 56, fontSize: { xs: 14, md: 16 } }}
              href="/cart"
            >
              Back To Cart
            </Button>

            <Button
              variant="contained"
              fullWidth
              sx={{ height: 56, fontSize: { xs: 14, md: 16 } }}
              onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }}
            >
              Proceed To Payment
            </Button>
          </Box>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item md={4} xs={12}>
          {/* FIX 4: sticky only on desktop — on mobile it's just a normal block */}
          <Card
            sx={{
              padding: { xs: "20px 16px", md: "40px" },
              position: { xs: "static", md: "sticky" },
              top: { md: 30 }
            }}
          >
            <Typography sx={{ fontSize: 26, fontWeight: 700, mb: 3 }}>
              Order Summary
            </Typography>

            {cart.map((item: any) => (
              <Box
                key={item.lineId}
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ fontSize: 16 }}>
                  {item.title} × {item.qty}
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  ${(item.price * item.qty).toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Box sx={{ borderTop: "1px solid #eee", pt: 2, mt: 2 }}>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 22,
                  fontWeight: 700
                }}
              >
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
