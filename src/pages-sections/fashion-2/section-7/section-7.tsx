<<<<<<< HEAD
"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Close from "@mui/icons-material/Close";
=======
import Button from "@mui/material/Button";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
// LOCAL CUSTOM COMPONENT
import { RootStyle } from "./styles";

export default function Section7() {
<<<<<<< HEAD
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => { setOpen(false); setSubmitted(false); setEmail(""); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
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

      {/* EMAIL SIGNUP MODAL */}
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
        {/* Gold accent bar */}
        <Box sx={{ height: 8, background: "linear-gradient(90deg, #b8972e 0%, #d4af55 50%, #b8972e 100%)" }} />

        <DialogContent sx={{ px: { xs: 4, sm: 7 }, py: { xs: 5, sm: 6 }, position: "relative" }}>

          {/* Close button */}
          <IconButton onClick={handleClose} sx={{ position: "absolute", top: 16, right: 16, color: "grey.400" }}>
            <Close sx={{ fontSize: 26 }} />
          </IconButton>

          {!submitted ? (
            <>
              {/* Eyebrow */}
              <Typography sx={{
                color: "#b8972e",
                letterSpacing: "0.25em",
                fontSize: "0.875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 1.5,
              }}>
                Exclusively Yours
              </Typography>

              {/* Headline */}
              <Typography sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
                lineHeight: 1.2,
                color: "#1a1a2e",
                mb: 2,
              }}>
                Handcrafted in Italy.<br />Curated for You.
              </Typography>

              {/* Body copy */}
              <Typography sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: 1.8,
                mb: 4,
              }}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#b8972e", borderWidth: 2 },
                    },
                    "& label.Mui-focused": { color: "#b8972e" },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#1a1a2e",
                    color: "white",
                    py: 2,
                    fontSize: "1.05rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    borderRadius: 1.5,
                    "&:hover": { backgroundColor: "#b8972e" },
                    transition: "background-color 250ms ease",
                  }}
                >
                  Join the Insider List
                </Button>
              </Box>

              <Typography sx={{
                display: "block",
                textAlign: "center",
                mt: 3,
                fontSize: "0.875rem",
                color: "text.disabled",
              }}>
                No spam. Unsubscribe anytime. We respect your privacy.
              </Typography>
            </>
          ) : (
            /* Success state */
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography sx={{ color: "#b8972e", fontWeight: 700, fontSize: "2rem", mb: 2 }}>
                Benvenuta! 🇮🇹
              </Typography>
              <Typography sx={{ color: "#1a1a2e", fontWeight: 600, fontSize: "1.4rem", mb: 1.5 }}>
                You're on the list.
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 420, mx: "auto" }}>
                Watch your inbox for exclusive early access, new arrivals,
                and members-only offers crafted just for you.
              </Typography>
              <Button
                onClick={handleClose}
                sx={{
                  mt: 4,
                  color: "#b8972e",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: "2px solid #b8972e",
                  px: 5,
                  py: 1.5,
                  borderRadius: 1.5,
                  "&:hover": { backgroundColor: "#b8972e", color: "white" },
                  transition: "all 250ms ease",
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          )}

        </DialogContent>
      </Dialog>
    </>
=======
  return (
    <RootStyle>
      <p className="subtitle">
        Extra <span color="primary.main">30% Off</span> Online
      </p>

      <h1 className="title">Summer Season Sale</h1>
      <p className="description">Free shipping on orders over $99</p>

      <Button variant="contained" size="large" color="dark">
        Shop Now
      </Button>
    </RootStyle>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  );
}
