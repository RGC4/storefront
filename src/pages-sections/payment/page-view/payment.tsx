"use client";

import Grid from "@mui/material/Grid";
<<<<<<< HEAD
import Container from "@mui/material/Container";
=======
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
// LOCAL CUSTOM COMPONENTS
import PaymentForm from "../payment-form";
import PaymentSummary from "../payment-summery";

export default function PaymentPageView() {
  return (
<<<<<<< HEAD
    // FIX: wrap in Container with responsive padding so it doesn't sit edge-to-edge on mobile
    <Container sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 3 } }}>
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid size={{ md: 8, xs: 12 }}>
          <PaymentForm />
        </Grid>

        <Grid size={{ md: 4, xs: 12 }}>
          <PaymentSummary />
        </Grid>
      </Grid>
    </Container>
=======
    <Grid container flexWrap="wrap-reverse" spacing={3}>
      <Grid size={{ md: 8, xs: 12 }}>
        <PaymentForm />
      </Grid>

      <Grid size={{ md: 4, xs: 12 }}>
        <PaymentSummary />
      </Grid>
    </Grid>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  );
}
