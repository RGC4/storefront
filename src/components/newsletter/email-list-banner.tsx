// src/components/newsletter/email-list-banner.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

// ======================================================
type Props = { image?: string };
// ======================================================

export default function EmailListBanner({
  image = "/assets/images/newsletter/banner-bg.jpg",
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");
  const [brands, setBrands] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, interests, brands }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe.");
      setStatus("success");
      setMessage("You're in! Check your inbox for a welcome email.");
      setEmail("");
      setName("");
      setInterests("");
      setBrands("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) handleSubmit();
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "rgba(255,255,255,0.93)",
      borderRadius: 1.5,
      fontSize: 15,
      height: 44,
      "& fieldset": { border: "none" },
    },
    "& .MuiInputBase-input": { py: 1.25, px: 2 },
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 600, md: 520 },
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        pb: { xs: "36px", md: "48px" },
      }}
    >
      {/* BACKGROUND IMAGE */}
      <Image
        fill
        src={image}
        alt="Email list banner"
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority
      />

      {/* DARK GRADIENT OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(5,15,25,0.78) 0%, rgba(5,15,25,0.42) 55%, rgba(5,15,25,0.12) 100%)",
        }}
      />

      {/* TEXT + INPUTS */}
      <Box sx={{ position: "relative", textAlign: "center", px: 4, width: "100%", maxWidth: 580 }}>
        <Typography
          variant="h1"
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: { xs: 26, md: 36 },
            letterSpacing: "-0.5px",
            mb: 1,
          }}
        >
          Join our Email List
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.9)",
            fontSize: { xs: 14, md: 18 },
            fontWeight: 400,
            mb: 2.5,
          }}
        >
          Get exclusive updates, new arrivals, and personal style recommendations
        </Typography>

        {status === "success" ? (
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              borderRadius: 2,
              py: 2.5,
              px: 3,
            }}
          >
            <Typography sx={{ color: "#4ade80", fontSize: 18, fontWeight: 600, mb: 0.5 }}>
              {message}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
              Our concierge team is here to help you find exactly what you're looking for.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {/* ROW 1: EMAIL + SUBSCRIBE */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "stretch",
              }}
            >
              <TextField
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                onKeyDown={handleKeyDown}
                size="small"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255,255,255,0.95)",
                    borderRadius: 1.5,
                    fontSize: 16,
                    height: 48,
                    "& fieldset": { border: "none" },
                  },
                  "& .MuiInputBase-input": { py: 1.5, px: 2 },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={status === "loading"}
                sx={{
                  bgcolor: "#1a2f4a",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  px: 4,
                  height: 48,
                  borderRadius: 1.5,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: "#243f62" },
                  "&.Mui-disabled": { bgcolor: "#1a2f4a", color: "rgba(255,255,255,0.7)" },
                }}
              >
                {status === "loading" ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </Box>

            {/* ROW 2: NAME */}
            <TextField
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              size="small"
              fullWidth
              sx={inputSx}
            />

            {/* ROW 3: INTERESTS + BRANDS */}
            <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                placeholder="What items interest you? (optional)"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                onKeyDown={handleKeyDown}
                size="small"
                sx={{ ...inputSx, flex: 1 }}
              />
              <TextField
                placeholder="Favorite brands? e.g. Prada, Coach... (optional)"
                value={brands}
                onChange={(e) => setBrands(e.target.value)}
                onKeyDown={handleKeyDown}
                size="small"
                sx={{ ...inputSx, flex: 1 }}
              />
            </Box>

            {status === "error" && (
              <Typography sx={{ color: "#f87171", fontSize: 14, mt: 0.5 }}>
                {message}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
