// DESTINATION: src/app/@modal/(.)mini-cart/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import { MiniCart } from "pages-sections/mini-cart";

export default function MiniCartDrawer() {
  const router = useRouter();

  return (
    <Drawer
      open
      anchor="right"
      onClose={router.back}
      sx={{ zIndex: 9999 }}
      slotProps={{
        paper: {
          sx: { width: 520 }
        }
      }}
    >
      <MiniCart />
    </Drawer>
  );
}
