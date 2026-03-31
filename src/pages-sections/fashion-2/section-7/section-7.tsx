// src/pages-sections/fashion-2/section-7/section-7.tsx
"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Close from "@mui/icons-material/Close";
import { RootStyle } from "./styles";

export default function Section7() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");
  const [brands, setBrands] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => {
    setOpen(false);
    setStatus("idle");
    setEmail("");
    setName("");
    setInterests("");
    setBrands("");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

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
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#b8972e", borderWidth: 2 },
    },
    "& label.Mui-focused": { color: "#b8972e" },
  };

  return (
    <>
      <RootStyle>
        <p className="subtitle">Handcrafted in Italy. Curated for You.</p>
        <h1 className="title">Join Our Insider List</h1>
        <p className="description">
          First access to new collections and members-only pricing — delivered straight to your inbox.
        </p>
        <Button
          variant="outlined"
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            color: "white",
            borderColor: "white",
            borderWidth: 2,
            px: 5,
            py: 1.5,
            fontSize: "0.95rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.15)",
              borderColor: "white",
              borderWidth: 2,
            },
          }}
        >
          Join the List
        </Button>
      </RootStyle>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            minWidth: { xs: "90vw", sm: 580, md: 700 },
          }
        }}
      >
        <Box sx={{ height: 8, background: "linear-gradient(90deg, #b8972e 0%, #d4af55 50%, #b8972e 100%)" }} />

        <DialogContent sx={{ px: { xs: 4, sm: 7 }, py: { xs: 5, sm: 6 }, position: "relative" }}>
          <IconButton onClick={handleClose} sx={{ position: "absolute", top: 16, right: 16, color: "grey.400" }}>
            <Close sx={{ fontSize: 26 }} />
          </IconButton>

          {status === "success" ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography sx={{ color: "#b8972e", fontWeight: 700, fontSize: "2rem", mb: 2 }}>Welcome! ✨</Typography>
              <Typography sx={{ color: "#1a1a2e", fontWeight: 600, fontSize: "1.4rem", mb: 1.5 }}>You're on the list.</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 420, mx: "auto" }}>
                Check your inbox for a welcome email with what's trending and details about our personal concierge service.
              </Typography>
              <Button
                onClick={handleClose}
                sx={{
                  mt: 4, color: "#b8972e", fontWeight: 700, fontSize: "0.95rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  border: "2px solid #b8972e", px: 5, py: 1.5, borderRadius: 1.5,
                  "&:hover": { backgroundColor: "#b8972e", color: "white" },
                  transition: "all 250ms ease",
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <>
              <Typography sx={{ color: "#b8972e", letterSpacing: "0.25em", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", mb: 1.5 }}>
                Exclusively Yours
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: "1.75rem", sm: "2.25rem" }, lineHeight: 1.2, color: "#1a1a2e", mb: 2 }}>
                Handcrafted in Italy.<br />Curated for You.
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: { xs: "1rem", sm: "1.1rem" }, lineHeight: 1.8, mb: 4 }}>
                Join our insider list for first access to new collections,
                members-only pricing, and stories from the artisans behind every bag.
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Your email address"
                  type="email"
                  required
                  fullWidth
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  variant="outlined"
                  inputProps={{ style: { fontSize: "1.05rem", padding: "18px 14px" } }}
                  InputLabelProps={{ style: { fontSize: "1rem" } }}
                  sx={inputSx}
                />
                <TextField
                  label="Your name"
                  fullWidth
                  value={name}
                  onChange={e => setName(e.target.value)}
                  variant="outlined"
                  inputProps={{ style: { fontSize: "1.05rem", padding: "16px 14px" } }}
                  InputLabelProps={{ style: { fontSize: "1rem" } }}
                  sx={inputSx}
                />
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                  <TextField
                    label="What items interest you?"
                    fullWidth
                    value={interests}
                    onChange={e => setInterests(e.target.value)}
                    variant="outlined"
                    inputProps={{ style: { fontSize: "0.95rem", padding: "16px 14px" } }}
                    InputLabelProps={{ style: { fontSize: "0.95rem" } }}
                    sx={inputSx}
                  />
                  <TextField
                    label="Favorite brands?"
                    fullWidth
                    value={brands}
                    onChange={e => setBrands(e.target.value)}
                    variant="outlined"
                    placeholder="e.g. Prada, Coach..."
                    inputProps={{ style: { fontSize: "0.95rem", padding: "16px 14px" } }}
                    InputLabelProps={{ style: { fontSize: "0.95rem" } }}
                    sx={inputSx}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={status === "loading"}
                  sx={{
                    backgroundColor: "#1a1a2e", color: "white", py: 2,
                    fontSize: "1.05rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    fontWeight: 700, borderRadius: 1.5,
                    "&:hover": { backgroundColor: "#b8972e" },
                    "&.Mui-disabled": { backgroundColor: "#1a1a2e", color: "rgba(255,255,255,0.7)" },
                    transition: "background-color 250ms ease",
                  }}
                >
                  {status === "loading" ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Join the Insider List"
                  )}
                </Button>
              </Box>
              {status === "error" && (
                <Typography sx={{ textAlign: "center", mt: 2, fontSize: "0.9rem", color: "error.main" }}>
                  {errorMsg}
                </Typography>
              )}
              <Typography sx={{ display: "block", textAlign: "center", mt: 3, fontSize: "0.875rem", color: "text.disabled" }}>
                No spam. Unsubscribe anytime. We respect your privacy.
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
