import type { ComponentProps } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";

// ==============================================================
interface MobileHeaderProps extends ComponentProps<typeof Box> {}
// ==============================================================

export function MobileHeader({ children, ...props }: MobileHeaderProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" {...props}>
      {children}
    </Box>
  );
}

// ==================================================================
interface MobileHeaderLeftProps extends ComponentProps<typeof Box> {}
// ==================================================================

MobileHeader.Left = function ({ children, ...props }: MobileHeaderLeftProps) {
  return (
    <Box flex={1} display="flex" alignItems="center" {...props}>
      {children}
    </Box>
  );
};

MobileHeader.Logo = function ({ logoUrl }: { logoUrl: string }) {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center" }}>
      <Image
        width={200}
        height={60}
        src="/assets/stores/s1/logo/logo-header-mobile.png"
        alt="Prestige Apparel Group"
        priority
        style={{ objectFit: "contain", objectPosition: "left center" }}
      />
    </Link>
  );
};

// ==================================================================
interface MobileHeaderRightProps extends ComponentProps<typeof Box> {}
// ==================================================================

MobileHeader.Right = function ({ children, ...props }: MobileHeaderRightProps) {
  return (
    <Box display="flex" justifyContent="end" alignItems="center" flexShrink={0} {...props}>
      {children}
    </Box>
  );
};
