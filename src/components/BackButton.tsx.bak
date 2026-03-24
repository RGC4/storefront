"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";

export default function BackButton() {
  const router = useRouter();

  return (
    <Box
      component="button"
      onClick={() => router.back()}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#111",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        mb: 2,
        px: 0,
        "&:hover": { color: "#555" },
      }}
    >
      <ArrowBackIos sx={{ fontSize: 13 }} />
      Back
    </Box>
  );
}
