// DESTINATION: src/pages-sections/mini-cart/components/empty-view.tsx
"use client";

import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FlexBox from "components/flex-box/flex-box";

export default function EmptyCartView() {
  const router = useRouter();

  return (
    <FlexBox
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      height="calc(100% - 74px)"
    >
      <Typography
        variant="body1"
        fontSize={16}
        color="text.secondary"
        sx={{
          my: 2,
          maxWidth: 200,
          textAlign: "center"
        }}
      >
        No products in the cart
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.back()}
      >
        Continue Shopping
      </Button>
    </FlexBox>
  );
}
