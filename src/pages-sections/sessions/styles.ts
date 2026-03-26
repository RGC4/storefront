"use client";

import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const Wrapper = styled(Card)(({ theme }) => ({
  width: 900,
  padding: "4.5rem 5rem",
  border: `1px solid ${theme.palette.grey[100]}`,
  [theme.breakpoints.down("sm")]: { width: "100%", padding: "3rem 2rem" },
  ".agreement": { marginTop: 12, marginBottom: 24 },
}));
