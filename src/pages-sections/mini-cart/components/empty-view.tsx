<<<<<<< HEAD
// DESTINATION: src/pages-sections/mini-cart/components/empty-view.tsx
"use client";

import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FlexBox from "components/flex-box/flex-box";

export default function EmptyCartView() {
  const router = useRouter();

=======
import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";

export default function EmptyCartView() {
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  return (
    <FlexBox
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      height="calc(100% - 74px)"
    >
<<<<<<< HEAD
=======
      <Image width={90} height={100} alt="banner" src="/assets/images/logos/shopping-bag.svg" />

>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
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

<<<<<<< HEAD
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.back()}
      >
        Continue Shopping
      </Button>
=======
      <Link href="/products/search">
        <Button variant="contained" color="primary">
          Continue Shopping
        </Button>
      </Link>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    </FlexBox>
  );
}
