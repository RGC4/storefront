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
  padding: "10px 12px 8px",
  borderBottom: "1px solid #f0f0f0",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: 80,

  ".vendor": {
    fontSize: 14,
    fontWeight: 800,
    color: "#111",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 4,
    textAlign: "center",
  },

  ".title": {
    fontSize: 12,
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
  height: 200,
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
});
