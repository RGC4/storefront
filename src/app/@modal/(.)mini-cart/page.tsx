// DESTINATION: src/app/@modal/(.)mini-cart/page.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import { MiniCart } from "pages-sections/mini-cart";

export default function MiniCartDrawer() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== "/mini-cart") return null;

  return (
    <Drawer
      open
      anchor="right"
      onClose={router.back}
      sx={{ zIndex: 9999 }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100vw", sm: 420, md: 520 },
            maxWidth: "100vw",
          },
        },
      }}
    >
      <MiniCart />
    </Drawer>
  );
}