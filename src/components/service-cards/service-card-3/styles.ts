"use client";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div")(({ theme }) => ({
  gap: 22,
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "25px 18px",
  border: "1px solid #000",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "flex-start",
  },
  h4: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
    lineHeight: 1.2,
    [theme.breakpoints.down("sm")]: { fontSize: 17 },
  },
  p: {
    color: theme.palette.grey[600],
    fontSize: 15,
    lineHeight: 1.4,
    [theme.breakpoints.down("sm")]: { fontSize: 14 },
  },
}));
