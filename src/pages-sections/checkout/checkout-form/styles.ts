import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const CardRoot = styled(Card)(({ theme }) => ({
  padding: "1.5rem",
  marginBottom: "2rem",
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`
}));

export const FormWrapper = styled("div")(({ theme }) => ({
  gap: 16,
  display: "grid",
  // Full Name (large) | Phone (medium) | Email (large) | Company (medium)
  // Address 1 (full)  | Address 2 (medium) | Country (medium) | Zip (small)
  gridTemplateColumns: "2fr 1.5fr 2fr 1.5fr",
  "& > *:nth-of-type(5)": {
    // Address 1 spans full row
    gridColumn: "1 / -1"
  },
  "& > *:nth-of-type(6)": {
    // Address 2
    gridColumn: "span 2"
  },
  "& > *:nth-of-type(7)": {
    // Country
    gridColumn: "span 1"
  },
  "& > *:nth-of-type(8)": {
    // Zip Code - narrow
    gridColumn: "span 1"
  },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr 1fr",
    "& > *:nth-of-type(5)": { gridColumn: "1 / -1" },
    "& > *:nth-of-type(6)": { gridColumn: "1 / -1" },
    "& > *:nth-of-type(7)": { gridColumn: "span 1" },
    "& > *:nth-of-type(8)": { gridColumn: "span 1" }
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    "& > *": { gridColumn: "1 / -1 !important" }
  }
}));

export const ButtonWrapper = styled("div")(({ theme }) => ({
  gap: 16,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" }
}));
