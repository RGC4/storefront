"use client";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div")(({ theme }) => ({
  gap: 16,
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "28px 20px",
  minHeight: 110,
  borderRight: `1px solid ${theme.palette.divider}`,
  ":last-child": { borderRight: 0 },
  [theme.breakpoints.down("md")]: {
    ":nth-of-type(even)": { borderRight: 0 },
    minHeight: 90,
  },
  [theme.breakpoints.down("sm")]: {
    borderRight: 0,
    justifyContent: "flex-start",
    minHeight: 80,
  },
  h4: { fontSize: 16, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 },
  p: { color: theme.palette.grey[600], fontSize: 13, lineHeight: 1.4 }
}));
