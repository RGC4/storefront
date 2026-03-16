import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
// CUSTOM COMPONENT
import LazyImage from "components/LazyImage";
import { HeaderCategoryDropdown } from "./header-category-dropdown";
// STYLED COMPONENTS
import { HeaderWrapper, StyledContainer } from "./styles";

// ==============================================================
interface HeaderProps extends ComponentProps<typeof HeaderWrapper> {
  mobileHeader: ReactNode;
}
// ==============================================================

export function Header({ children, mobileHeader, ...props }: HeaderProps) {
  return (
    <HeaderWrapper {...props}>
      <StyledContainer>
        <div className="main-header">{children}</div>
        <div className="mobile-header">{mobileHeader}</div>
      </StyledContainer>
    </HeaderWrapper>
  );
}

// ==============================================================
interface HeaderLeftProps extends ComponentProps<typeof Box> {}
// ==============================================================

Header.Left = function ({ children, ...props }: HeaderLeftProps) {
  return (
    <Box display="flex" minWidth={100} alignItems="center" {...props}>
      {children}
    </Box>
  );
};

// ==============================================================
interface HeaderLogoProps {
  url: string;
}
// ==============================================================

Header.Logo = function ({ url }: HeaderLogoProps) {
  return (
    <Link href="/">
      <LazyImage
        priority
        src={url}
        alt="logo"
<<<<<<< HEAD
        width={230}
        height={100}
        sizes="(max-width: 768px) 130px, 180px"
=======
        width={105}
        height={50}
        sizes="(max-width: 768px) 80px, 105px"
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
        sx={{ objectFit: "contain" }}
      />
    </Link>
  );
};

Header.CategoryDropdown = function ({ children }: PropsWithChildren) {
  return <HeaderCategoryDropdown>{children}</HeaderCategoryDropdown>;
};

Header.Mid = function ({ children }: PropsWithChildren) {
  return children;
};

// ==============================================================
interface HeaderRightProps extends ComponentProps<typeof Box> {}
// ==============================================================

Header.Right = function ({ children, ...props }: HeaderRightProps) {
  return <Box {...props}>{children}</Box>;
};
