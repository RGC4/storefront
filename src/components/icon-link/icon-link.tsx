import { LinkProps } from "next/link";
import type { SxProps, Theme } from "@mui/material/styles";
import ArrowRightAlt from "@mui/icons-material/ArrowRightAlt";
// STYLED COMPONENT
import { StyledLink } from "./styles";

  url: string;
  title: string;
  sx?: SxProps<Theme>;
}
  return (
    <StyledLink href={url} sx={sx}>
      <span>{title}</span>
      <ArrowRightAlt fontSize="small" color="inherit" className="icon" />
    </StyledLink>
  );
}
