import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
// CUSTOM COMPONENT
import LazyImage from "components/LazyImage";
import { HeaderCategoryDropdown } from "./header-category-dropdown";
// STYLED COMPONENTS
import { HeaderWrapper, StyledContainer } from "./styles";

// =======================================================        sx={{ objectFit: "contain" }}
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
