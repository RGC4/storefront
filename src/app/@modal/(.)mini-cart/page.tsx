<<<<<<< HEAD
// DESTINATION: src/app/@modal/(.)mini-cart/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";
=======
"use client";

import { usePathname, useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";
// GLOBAL CUSTOM COMPONENTS
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import { MiniCart } from "pages-sections/mini-cart";

export default function MiniCartDrawer() {
  const router = useRouter();
<<<<<<< HEAD

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
=======
  const pathname = usePathname();

  if (pathname !== "/mini-cart") return null;

  return (
    <Drawer open anchor="right" onClose={router.back} sx={{ zIndex: 9999 }}>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      <MiniCart />
    </Drawer>
  );
}
