"use client";

import { styled } from "@mui/material/styles";

export const RootStyle = styled("div")(({ theme }) => ({
  display: "grid",
  padding: "0",
  width: "100%",
  gridTemplateColumns: "repeat(4, 1fr)",
  backgroundColor: theme.palette.common.white,
  borderTop: "1px solid #000",
  [theme.breakpoints.down("sm")]: { display: "none" },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)"
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr"
  }
}));
