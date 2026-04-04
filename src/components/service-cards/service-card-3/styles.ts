"use client";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div")(({ theme }) => ({
  gap: 22,
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "25px 18px",
  borderRight: `1px solid ${theme.palette.divider}`,
  ":last-child": { borderRight: 0 },
  [theme.breakpoints.down("md")]: {
    ":nth-of-type(even)": { borderRight: 0 },
  },
  [theme.breakpoints.down("sm")]: {
    borderRight: 0,
    justifyContent: "flex-start",
  },
  h4: {
    fontSize: 17,       // was 21 â†’ -20%
    fontWeight: 700,
    marginBottom: 4,
    lineHeight: 1.2,
    [theme.breakpoints.down("sm")]: { fontSize: 15 }, // was 19 â†’ -20%
  },
  p: {
    color: theme.palette.grey[600],
    fontSize: 13,       // was 16 â†’ -20%
    lineHeight: 1.4,
    [theme.breakpoints.down("sm")]: { fontSize: 11 }, // was 14 â†’ -20%
  },
}));
