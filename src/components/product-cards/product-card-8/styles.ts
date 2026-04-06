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
  minHeight: 90,        // was fixed 110 â€” now min so long titles show fully
  flexShrink: 0,
  "@media (max-width: 768px)": { minHeight: 70, padding: "8px 10px" },
  ".vendor": {
    fontSize: 16,       // was 13px â€” increased 25%
    fontWeight: 700,
    color: "#111",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 4,
    "@media (max-width: 768px)": { fontSize: 14 },
  },
  ".title": {
    fontSize: 13,       // was 17px â€” reduced to match theme subtitle1
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#666",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3, // was 2 â€” allow 3 lines so titles don't get cut off
    WebkitBoxOrient: "vertical" as const,
    textAlign: "center",
    "@media (max-width: 768px)": { fontSize: 12 },
  },
});

export const CardMedia = styled("div")({
  width: "100%",
  aspectRatio: "1 / 1",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  overflow: "hidden",
  position: "relative",
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
    fontSize: 11,       // was 12
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
});

export const CardContent = styled("div")({
  padding: "10px 14px 12px",
  borderTop: "1px solid #f0f0f0",
  textAlign: "center",
  flexShrink: 0,
  ".price-block": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ".retail-price": {
    fontSize: 13,       // was 17
    color: "#999",
    textDecoration: "line-through",
  },
  ".wholesale-price": {
    fontSize: 18,       // was 26
    fontWeight: 800,
    color: "#111",
  },
});
