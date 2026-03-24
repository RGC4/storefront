"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";

export default function BackButton() {
  const router = useRouter();

  return (
    <Box
      component="button"
      onClick={() => router.back()}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#111",
        fontSize: { xs: "16px", md: "18.75px" },
        fontWeight: 600,
        letterSpacing: "0.02em",
        mb: 3,
        px: 0,
        "&:hover": { color: "#b8972e" },
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Back to Store
    </Box>
  );
}
