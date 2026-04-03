"use client";

import { styled } from "@mui/material/styles";

export const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  marginTop: "4rem",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  color: "white",
  textAlign: "center",
  padding: "4rem 2rem",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#000000",
  backgroundRepeat: "no-repeat",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.55)",
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },

  // Subtitle/eyebrow — was 22px, now 12px (overline style)
  "& .subtitle": {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: "0.1em",
    marginBottom: "0.75rem",
    color: "#d4af55",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: { fontSize: 11 },
  },

  // Main title — was 54px, now 28px (theme h3)
  "& .title": {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    margin: "0 0 1rem 0",
    padding: 0,
    [theme.breakpoints.down("sm")]: { fontSize: 22 },
  },

  // Description — was 18px, now 15px (theme body1)
  "& .description": {
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.7,
    maxWidth: 520,
    opacity: 0.9,
    margin: "0 0 2rem 0",
    padding: 0,
    [theme.breakpoints.down("sm")]: { fontSize: 13 },
  },
}));
