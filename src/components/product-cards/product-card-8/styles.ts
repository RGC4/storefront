"use client";
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
  padding: "14px 12px",
  borderBottom: "1px solid #f0f0f0",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 90,
  flexShrink: 0,
  "@media (max-width: 768px)": { minHeight: 56, padding: "6px 6px" },
  ".vendor": {
    fontSize: 16,
    fontWeight: 700,
    color: "#111",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 4,
    "@media (max-width: 768px)": { fontSize: 11, letterSpacing: "0.05em", marginBottom: 2 },
  },
  ".title": {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#666",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical" as const,
    textAlign: "center",
    "@media (max-width: 768px)": { fontSize: 10, lineHeight: 1.3, WebkitLineClamp: 2 },
  },
});

export const CardMedia = styled("div")({
  width: "100%",
  aspectRatio: "4 / 3",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  overflow: "hidden",
  position: "relative",
  padding: 12,
  "@media (max-width: 768px)": { padding: 6 },
  img: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    objectPosition: "center",
  },
  ".discount-badge": {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#c41230",
    color: "white",
    padding: "4px 10px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.05em",
    "@media (max-width: 768px)": { top: 6, left: 6, padding: "2px 6px", fontSize: 9 },
  },
});

export const CardContent = styled("div")({
  padding: "10px 14px 12px",
  borderTop: "1px solid #f0f0f0",
  textAlign: "center",
  flexShrink: 0,
  "@media (max-width: 768px)": { padding: "6px 6px 8px" },
  ".price-block": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    "@media (max-width: 768px)": { gap: 4 },
  },
  ".retail-price": {
    fontSize: 13,
    color: "#999",
    textDecoration: "line-through",
    "@media (max-width: 768px)": { fontSize: 10 },
  },
  ".wholesale-price": {
    fontSize: 18,
    fontWeight: 800,
    color: "#111",
    "@media (max-width: 768px)": { fontSize: 13 },
  },
});
