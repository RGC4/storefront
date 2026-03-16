"use client";

import { styled } from "@mui/material/styles";

<<<<<<< HEAD
export const StyledRoot = styled("div")(({ theme }) => ({
  gap: 24,
=======
// STYLED COMPONENTS
export const StyledRoot = styled("div")(({ theme }) => ({
  gap: 16,
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
<<<<<<< HEAD
  padding: "42px 24px",
=======
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  borderRight: `1px solid ${theme.palette.divider}`,
  ":last-child": { borderRight: 0 },
  [theme.breakpoints.down("md")]: {
    ":nth-of-type(even)": { borderRight: 0 }
  },
  [theme.breakpoints.down("sm")]: {
    borderRight: 0,
    justifyContent: "flex-start"
  },
<<<<<<< HEAD
  h4: { fontSize: 26, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 },
  p: { color: theme.palette.grey[600], fontSize: 18, lineHeight: 1.4 }
=======
  h4: { fontSize: 17, fontWeight: 600 },
  p: { color: theme.palette.grey[600] }
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
}));
