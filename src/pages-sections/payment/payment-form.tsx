"use client";

import Link from "next/link";
import { Fragment, useCallback, useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FlexBox from "components/flex-box/flex-box";
import FormLabel from "./form-label";
import CreditCardForm from "./credit-card-form";
import useCart from "hooks/useCart";

export default function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const { state } = useCart();

  const handleChangeTo = useCallback((e: React.SyntheticEvent<Element, Event>) => {
    setPaymentMethod((e.target as HTMLInputElement).name);
  }, []);

  // If store has a real Shopify checkout URL, send them there directly
  const handleProceed = () => {
    if (state?.checkoutUrl) {
      window.location.href = state.checkoutUrl;
    }
  };

  return (
    <Fragment>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Payment Method
      </Typography>

      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "grey.50",
          padding: { sm: 3, xs: 2 },
        }}
      >
        {/* CREDIT CARD */}
        <FormLabel
          name="credit-card"
          title="Pay with Credit Card"
          checked={paymentMethod === "credit-card"}
          handleChange={handleChangeTo}
        />
        {paymentMethod === "credit-card" && <CreditCardForm />}

        <Divider sx={{ my: 3 }} />

        {/* PAYPAL */}
        <FormLabel
          name="paypal"
          title="Pay with PayPal"
          checked={paymentMethod === "paypal"}
          handleChange={handleChangeTo}
        />
        {paymentMethod === "paypal" && (
          <FlexBox alignItems="center" gap={2} mt={2}>
            <TextField fullWidth name="email" type="email" label="PayPal Email" placeholder="you@example.com" />
            <Button variant="outlined" color="primary" type="button" sx={{ whiteSpace: "nowrap" }}>
              Connect
            </Button>
          </FlexBox>
        )}
      </Card>

      {/* NAV BUTTONS */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          fullWidth
          size="large"
          color="primary"
          href="/checkout"
          variant="outlined"
          LinkComponent={Link}
        >
          Back to Details
        </Button>

        <Button
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          onClick={handleProceed}
          disabled={!state?.checkoutUrl}
        >
          Complete Purchase
        </Button>
      </Stack>
    </Fragment>
  );
}
