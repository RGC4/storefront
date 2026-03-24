"use client";

import { styled } from "@mui/material/styles";

export const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",
  padding: "2rem 2rem 3rem",
  backgroundColor: "#fff",
  border: "1px solid #e8e8e8",

  "& strong": { fontWeight: 700 },
  "& .rating": { display: "none" },
  "& .shop": { display: "none" },

  "& .variant-group": {
    gap: "0.5rem",
    display: "flex",
    alignItems: "center",
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
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    padding: "8px",
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
}));
