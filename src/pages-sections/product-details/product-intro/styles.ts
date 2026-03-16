"use client";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",
<<<<<<< HEAD
  padding: "2rem 2rem 3rem",
  backgroundColor: "#fff",
  border: "1px solid #e8e8e8",

  "& strong": { fontWeight: 700 },
  "& .rating": { display: "none" },
  "& .shop": { display: "none" },

=======
  padding: "1.5rem",
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  "& strong": { fontWeight: 600 },
  "& .rating": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  "& .price": {
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(3)
  },
  "& .shop": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1)
  },
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  "& .variant-group": {
    gap: "0.5rem",
    display: "flex",
    alignItems: "center",
<<<<<<< HEAD
    flexWrap: "wrap",
    "& .MuiChip-root": {
      height: 36,
      cursor: "pointer",
      borderRadius: "4px",
      fontSize: 14,
    },
  },
}));

export const ProductImageWrapper = styled("div")(({ theme }) => ({
  height: 680,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
  backgroundColor: "#fff",
  border: "1px solid #e8e8e8",

  "& img": {
    objectFit: "contain",
    objectPosition: "center center",
    padding: "24px",
  },

  [theme.breakpoints.down("sm")]: {
    height: 420,
  },
}));

export const PreviewImage = styled("div", {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected: boolean }>(({ selected }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 0,
  overflow: "hidden",
  width: 110,
  height: 110,
  cursor: "pointer",
  position: "relative",
  backgroundColor: "#fff",
  transition: "all 0.2s ease-in-out",
  border: selected ? "2px solid #111" : "1px solid #e8e8e8",
=======
    "& .MuiChip-root": { height: 28, cursor: "pointer", borderRadius: "6px" }
  }
}));

export const ProductImageWrapper = styled("div")(({ theme }) => ({
  height: 500,
  display: "flex",
  overflow: "hidden",
  position: "relative",
  justifyContent: "center",
  marginBottom: theme.spacing(6),
  "& img": { objectFit: "cover" },
  [theme.breakpoints.down("sm")]: { height: 300 },
  "& + .preview-images": {
    overflow: "auto",
    display: "flex",
    gap: theme.spacing(1),
    justifyContent: "center"
  }
}));

export const PreviewImage = styled("div", {
  shouldForwardProp: (prop) => prop !== "selected"
})<{ selected: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  overflow: "hidden",
  width: 64,
  height: 64,
  cursor: "pointer",
  position: "relative",
  backgroundColor: "white",
  opacity: selected ? 1 : 0.5,
  transition: "all 0.2s ease-in-out",
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
}));
