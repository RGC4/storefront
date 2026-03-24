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

  "& .subtitle": {
    fontSize: 22,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: "0.06em",
    marginBottom: "0.75rem",
    color: "#d4af55",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: { fontSize: 17 },
  },

  "& .title": {
    fontSize: 54,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
    // Reset browser/MUI h1 defaults that shrink the font
    margin: "0 0 1rem 0",
    padding: 0,
    [theme.breakpoints.down("sm")]: { fontSize: 36 },
  },

  "& .description": {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.7,
    maxWidth: 520,
    opacity: 0.9,
    // Reset browser p defaults
    margin: "0 0 2rem 0",
    padding: 0,
    [theme.breakpoints.down("sm")]: { fontSize: 15 },
  },
}));
