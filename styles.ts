"use client";

/**
 * src/components/product-cards/product-card-8/styles.ts
 *
 * FIXES in this version:
 * - Removed padding: "8%" on img (was shrinking Fendi even smaller)
 * - objectFit: "contain" so full bag is always visible
 * - background: "#f8f8f8" on CardMedia for clean letterbox fill
 * - Discount badge stays in CardMedia only (do NOT add it in CardHeader)
 *
 * NOTE: After deploying this, run the audit script to permanently
 * fix the Fendi source image whitespace:
 *   node scripts/audit-images.js --fix --trim
 */

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
  padding: "16px",
  borderBottom: "1px solid #f0f0f0",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: 110,
  flexShrink: 0,
  "@media (max-width: 768px)": { height: 80, padding: "8px 10px" },
  ".vendor": {
    fontSize: 22,
    fontWeight: 800,
    color: "#111",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 4,
    "@media (max-width: 768px)": { fontSize: 14 },
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
    "@media (max-width: 768px)": { fontSize: 13 },
  },
});

export const CardMedia = styled("div")({
  width: "100%",
  aspectRatio: "1 / 1",
  flexShrink: 0,
  position: "relative",
  background: "#f8f8f8",
  overflow: "hidden",
  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",       // full bag always visible — no cropping
    objectPosition: "center",
    display: "block",
    // NO padding — padding shrinks the image inside the box
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
    zIndex: 1,
  },
});

export const CardContent = styled("div")({
  padding: "12px 16px 14px",
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
    fontSize: 17,
    color: "#999",
    textDecoration: "line-through",
  },
  ".wholesale-price": {
    fontSize: 26,
    fontWeight: 800,
    color: "#111",
  },
});
