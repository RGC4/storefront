// src/pages-sections/sessions/page-view/login.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Updated login page — redirects to Shopify's hosted login.
// Shopify handles: magic link, Google, passkeys.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSearchParams } from "next/navigation";

export default function LoginPageView() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const handleSignIn = () => {
    window.location.href = `/api/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  const errorMessages: Record<string, string> = {
    auth_failed: "Authentication failed. Please try again.",
    shopify_error: "Shopify returned an error. Please try again.",
    state_mismatch: "Security check failed. Please try again.",
    token_exchange_failed: "Login failed. Please try again.",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
      {error && (
        <Typography color="error" variant="body2" textAlign="center">
          {errorMessages[error] || "An error occurred. Please try again."}
        </Typography>
      )}

      <Typography variant="body1" textAlign="center" color="text.secondary" fontSize="1.5rem">
        Sign in securely with your email — no password needed.
      </Typography>

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        onClick={handleSignIn}
        sx={{ py: 1.5, fontSize: "1.2rem", borderRadius: 1.5, width: "50%", mx: "auto", display: "block" }}
      >
        Sign In / Register
      </Button>
    </Box>
  );
}
