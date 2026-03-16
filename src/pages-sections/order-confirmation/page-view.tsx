"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Wrapper, StyledButton } from "./styles";

export default function OrderConfirmationPageView() {
  return (
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
      </Wrapper>
    </Container>
  );
}
