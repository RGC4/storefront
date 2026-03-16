"use client";

<<<<<<< HEAD
import { styled } from "@mui/material/styles";

export const Card = styled("div")({
  width: "100%",
  overflow: "hidden",
  background: "#fff",
  border: "1px solid #e8e8e8",
  transition: "all 0.2s ease",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",

  ":hover": {
    borderColor: "#aaa",
    boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
    transform: "translateY(-2px)",
  },
});

export const CardHeader = styled("div")({
  padding: "20px 16px 18px",
  borderBottom: "1px solid #f0f0f0",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: 120,

  ".vendor": {
    fontSize: 21,
    fontWeight: 800,
    color: "#111",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 4,
    textAlign: "center",
  },

  ".title": {
    fontSize: 17,
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#666",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    textAlign: "center",
  },
});

export const CardMedia = styled("div")({
  width: "100%",
  height: 460,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",

  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    padding: "16px",
  },

  ".discount-badge": {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#c41230",
    color: "white",
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
});

export const CardContent = styled("div")({
  padding: "12px 16px 14px",
  borderTop: "1px solid #f0f0f0",
  textAlign: "center",

  ".price-block": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  ".retail-price": {
    textDecoration: "line-through",
    fontSize: 13,
    color: "#aaa",
  },

  ".wholesale-price": {
    fontSize: 18,
    fontWeight: 800,
    color: "#111",
  },
=======
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

export const Card = styled("div")({
  ":hover": {
    img: { transform: "scale(1.1)" },
    ".product-actions": { right: 15 },
    ".product-view-action": { opacity: 1 }
  }
});

export const CardMedia = styled("div")(({ theme }) => ({
  aspectRatio: "1/1",
  borderRadius: 12,
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.grey[50],
  img: { transition: "0.3s" },
  ".quick-view-btn": {
    position: "relative",
    marginInline: theme.spacing(1)
  }
}));

export const CardContent = styled("div")(({ theme }) => ({
  padding: "1rem",
  textAlign: "center",
  ".title": {
    fontSize: 16,
    fontWeight: 600
  },
  ".category": {
    fontSize: 12,
    color: theme.palette.grey[500]
  },
  ".price": {
    fontSize: 16,
    fontWeight: 600,
    paddingBlock: "0.25rem"
  },
  ".ratings": {
    gap: ".5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ".total": { fontSize: 12, color: theme.palette.grey[500] }
  }
}));

export const AddToCartButton = styled(IconButton)(({ theme }) => ({
  top: 15,
  right: -40,
  position: "absolute",
  backgroundColor: "white",
  transition: "right 0.3s .1s",
  color: theme.palette.text.primary,
  ".icon": { fontSize: 16 }
}));

export const FavoriteButton = styled(IconButton)(({ theme }) => ({
  top: 55,
  right: -40,
  position: "absolute",
  backgroundColor: "white",
  transition: "right 0.3s .2s",
  color: theme.palette.text.primary,
  ".icon": { fontSize: 16 }
}));

export const QuickViewButton = styled(Button)({
  left: 0,
  bottom: 12,
  opacity: 0,
  borderRadius: 12,
  position: "absolute",
  transition: "opacity 0.5s"
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
});
