import type { ComponentProps, PropsWithChildren } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
// CUSTOM COMPONENT
import LazyImage from "components/LazyImage";
import { HeaderCategoryDropdown } from "./header-category-dropdown";
// STYLED COMPONENTS
import { HeaderWrapper, StyledContainer } from "./styles";

// ==============================================================
interface HeaderProps extends ComponentProps<typeof HeaderWrapper> {}
// ==============================================================

export function Header({ children, ...props }: HeaderProps) {
  return (
    <HeaderWrapper {...props}>
      <StyledContainer>
        <div>{children}</div>
      </StyledContainer>
    </HeaderWrapper>
  );
}

// ==============================================================
interface HeaderLogoProps {
  logoUrl: string;
  width?: number;
  height?: number;
}
// ==============================================================

Header.Logo = function ({ logoUrl, width = 120, height = 44 }: HeaderLogoProps) {
  return (
    <Link href="/">
      <LazyImage
        src={logoUrl}
        alt="Store Logo"
        width={width}
        height={height}
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
