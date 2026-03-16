import type { PropsWithChildren } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
// STYLED COMPONENT
import { StyledScrollbar } from "./styles";

  className?: string;
  sx?: SxProps<Theme>;
}
  return (
    <StyledScrollbar
      defer
      sx={sx}
      className={className}
      options={{ scrollbars: { autoHide: "leave", autoHideDelay: 100 } }}
    >
      {children}
    </StyledScrollbar>
  );
}
