"use client";

import Link from "next/link";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { Variant } from "./types";

export const StyledLink = styled(Link)(() => ({
  borderRadius: 4,
  display: "block",
  cursor: "pointer",
  position: "relative",
  padding: "0.35rem 0",
  fontSize: 15,
  color: "rgba(255,255,255,0.75)",
  textDecoration: "none",
  transition: "color 150ms ease",
  ":hover": {
    color: "#ffffff",
    textDecoration: "underline",
  },
}));

export const StyledFooter = styled("footer")(({ theme }) => ({
  color: "white",
  borderRadius: 12,
  padding: "2.5rem",
  marginBottom: "1rem",
  backgroundColor: theme.palette.grey[900],
  "& .links": {
    marginTop: "4rem",
    marginBottom: "1rem",
    [theme.breakpoints.down("sm")]: { marginTop: 0 },
  },
  [theme.breakpoints.down("lg")]: { marginBottom: "5rem" },
}));

export const Heading = styled("h6")({
  fontSize: 18,
  lineHeight: 1.4,
  fontWeight: 600,
  marginBottom: 16,
  marginTop: 0,
  color: "#ffffff",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
});

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant: Variant }>(({ variant, theme }) => ({
  margin: 4,
  fontSize: 18,
  borderRadius: 6,
  padding: "10px",
  transition: "all 0.3s ease",
  ".icon": { color: "white" },
  ...(variant === "light" && {
    backgroundColor: theme.palette.grey[800],
    ":hover": {
      backgroundColor: theme.palette.common.white,
      ".icon": { color: theme.palette.grey[900] },
    },
  }),
  ...(variant === "dark" && {
    backgroundColor: theme.palette.grey[900],
    ":hover": { backgroundColor: theme.palette.grey[700] },
  }),
}));

export const AppItem = styled("div")({
  gap: 8,
  margin: 8,
  color: "white",
  display: "flex",
  borderRadius: 8,
  padding: "12px 16px",
  alignItems: "center",
  backgroundColor: "#0C2A4D",
  "& .title": { fontSize: "15px", fontWeight: 500, lineHeight: 1.3 },
  "& .subtitle": { lineHeight: 1, fontSize: "11px" },
});
