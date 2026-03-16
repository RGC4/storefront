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
  padding: "4rem 2rem",          // reduced from 7rem → 4rem
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#2a1f0e",
  backgroundRepeat: "no-repeat",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "rgba(20, 14, 6, 0.55)",
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
    lineHeight: 1.1,
    fontWeight: 700,
    marginBottom: "1rem",
    letterSpacing: "-0.01em",
    [theme.breakpoints.down("sm")]: { fontSize: 36 },
  },

  "& .description": {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.7,
    marginBottom: "2rem",
    maxWidth: 520,
    opacity: 0.9,
    [theme.breakpoints.down("sm")]: { fontSize: 15 },
  },
}));
