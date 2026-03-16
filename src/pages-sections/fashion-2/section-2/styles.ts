"use client";

import { styled } from "@mui/material/styles";

<<<<<<< HEAD
export const RootStyle = styled("div")(({ theme }) => ({
  display: "grid",
  padding: "0",
  width: "100%",
  gridTemplateColumns: "repeat(4, 1fr)",
  backgroundColor: theme.palette.common.white,
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)"
  },
  [theme.breakpoints.down("sm")]: {
=======
// STYLED COMPONENTS
export const RootStyle = styled("div")(({ theme }) => ({
  borderRadius: 8,
  display: "grid",
  padding: "2rem 0",
  gridTemplateColumns: "repeat(4, 1fr)",
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("md")]: {
    gap: 30,
    gridTemplateColumns: "repeat(2, 1fr)"
  },
  [theme.breakpoints.down("sm")]: {
    gap: 30,
    paddingLeft: "2rem",
    paddingRight: "2rem",
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    gridTemplateColumns: "1fr"
  }
}));
