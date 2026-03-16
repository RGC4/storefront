"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
<<<<<<< HEAD
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
=======
// STYLED COMPONENT
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import { Wrapper, StyledButton } from "./styles";

export default function OrderConfirmationPageView() {
  return (
<<<<<<< HEAD
    <Container sx={{ py: { xs: 4, md: 8 } }}>
      <Wrapper>
        <Image
          width={100}
          height={100}
          alt="Order confirmed"
          src="/assets/images/illustrations/party-popper.svg"
        />

        <Typography variant="h3" fontWeight={800} mt={3} mb={1} textAlign="center">
          Order Confirmed!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ px: { xs: 1, sm: 4 }, lineHeight: 1.8 }}
        >
          Thank you for your purchase. We've received your order and you'll
          receive a confirmation email with tracking details shortly.
        </Typography>

        <Divider sx={{ width: "100%", my: 3 }} />

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} width="100%" justifyContent="center">
          <StyledButton
            color="primary"
            disableElevation
            variant="contained"
            LinkComponent={Link}
            href="/"
          >
            Continue Shopping
          </StyledButton>

          <Button
            variant="outlined"
            color="primary"
            component={Link}
            href="/profile/orders"
            sx={{ px: 4, py: 1.4 }}
          >
            View My Orders
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" mt={3} textAlign="center">
          Questions? {" "}
          <Link href="/support-tickets" style={{ color: "inherit", fontWeight: 600 }}>
            Open a support ticket
          </Link>
          {" "} or email us at {" "}
          <a
            href="mailto:info@prestigeapparelgroup.com"
            style={{ color: "inherit", fontWeight: 600 }}
          >
            info@prestigeapparelgroup.com
          </a>
        </Typography>
=======
    <Container className="mt-2 mb-5">
      <Wrapper>
        <Image
          width={116}
          height={116}
          alt="complete"
          src="/assets/images/illustrations/party-popper.svg"
        />

        <Typography variant="h1" fontWeight={700}>
          Thank you for your purchase!
        </Typography>

        <Typography
          fontSize={16}
          variant="body1"
          color="text.secondary"
          sx={{ padding: ".5rem 2rem" }}
        >
          We have received your order and you will be receiving confirmation email with order
          details.
        </Typography>

        <Typography fontSize={16} variant="body1" color="text.secondary">
          Your order number is <strong>#1234567890</strong>.
        </Typography>

        <StyledButton
          color="primary"
          disableElevation
          variant="contained"
          className="button-link"
          LinkComponent={Link}
          href="/market-1"
        >
          Browse products
        </StyledButton>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      </Wrapper>
    </Container>
  );
}
