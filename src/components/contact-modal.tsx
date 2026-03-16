"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";

const CATEGORIES = [
  "Order Issue",
  "Return / Exchange",
  "Shipping & Delivery",
  "Product Question",
  "Billing & Payment",
  "Other",
];

const PRIORITIES = ["Normal", "High", "Urgent"];

const EMPTY_FORM = {
  name: "",
  email: "",
  orderNumber: "",
  category: "Order Issue",
  subject: "",
  message: "",
  priority: "Normal",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ticketId: string } | null>(null);
  const [error, setError] = useState("");

  const handleClose = () => {
    onClose();
    // Reset after close animation finishes
    setTimeout(() => { setResult(null); setError(""); setForm(EMPTY_FORM); }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setResult({ ticketId: data.ticketId });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden" }
      }}
    >
      {/* Gold accent bar */}
      <Box sx={{ height: 6, background: "linear-gradient(90deg, #b8972e 0%, #d4af55 50%, #b8972e 100%)" }} />

      <DialogContent sx={{ px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 5 }, position: "relative" }}>

        {/* Close button */}
        <IconButton onClick={handleClose} sx={{ position: "absolute", top: 12, right: 12, color: "grey.400" }}>
          <Close sx={{ fontSize: 24 }} />
        </IconButton>

        {/* Header */}
        <Typography sx={{ color: "#b8972e", letterSpacing: "0.2em", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", mb: 1 }}>
          We're here to help
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", sm: "1.9rem" }, color: "#1a1a2e", mb: 0.5 }}>
          Contact Us
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", mb: 3, lineHeight: 1.7 }}>
          Fill out the form below and our team will get back to you within 1–2 business days.
        </Typography>

        {result ? (
          /* SUCCESS STATE */
          <Box textAlign="center" py={4}>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: "#b8972e" }}>
              Request Received ✓
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Thank you! We've received your message.
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Your ticket reference number is:
            </Typography>
            <Typography sx={{
              display: "inline-block", px: 3, py: 1,
              bgcolor: "#f5f0e8", color: "#b8972e",
              borderRadius: 2, letterSpacing: 2, fontWeight: 700, fontSize: "1.1rem", mb: 3
            }}>
              {result.ticketId}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Please save this reference number. A confirmation has been sent to your email.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ borderColor: "#b8972e", color: "#b8972e", "&:hover": { bgcolor: "#b8972e", color: "white" } }}
            >
              Close
            </Button>
          </Box>
        ) : (
          /* FORM */
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" fontWeight={600} mb={2.5} sx={{ fontSize: "1rem", color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Support Request
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

            <Stack spacing={2.5}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required name="name" label="Full Name" value={form.name} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required name="email" type="email" label="Email Address" value={form.email} onChange={handleChange} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField select fullWidth name="category" label="Category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField select fullWidth name="priority" label="Priority" value={form.priority} onChange={handleChange}>
                    {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </TextField>
                </Grid>
              </Grid>

              <TextField fullWidth name="orderNumber" label="Order Number (optional)" value={form.orderNumber} onChange={handleChange} />
              <TextField fullWidth name="subject" label="Subject" value={form.subject} onChange={handleChange} />
              <TextField
                fullWidth required multiline rows={4}
                name="message" label="Message"
                value={form.message} onChange={handleChange}
                placeholder="Please describe your issue in as much detail as possible…"
              />

              <Button
                fullWidth size="large" type="submit" variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{
                  backgroundColor: "#1a1a2e",
                  py: 1.75,
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  "&:hover": { backgroundColor: "#b8972e" },
                  transition: "background-color 250ms ease",
                }}
              >
                {loading ? "Submitting…" : "Submit Request"}
              </Button>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
