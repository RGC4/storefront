// DESTINATION: src/pages-sections/contact/page-view.tsx
"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const CATEGORIES = [
  "Order Issue",
  "Return / Exchange",
  "Shipping & Delivery",
  "Product Question",
  "Billing & Payment",
  "Other",
];

const PRIORITIES = ["Normal", "High", "Urgent"];

const FAQ = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 5–7 business days. Express 2–3 business days.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 7 business days of delivery. Items must be unused and in original packaging.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Order Lookup page with your order number and email address.",
  },
  {
    q: "Are all items authentic?",
    a: "Yes. Every item sold by Prestige Apparel Group is 100% authentic and sourced directly from authorized distributors.",
  },
];

export default function ContactPageView() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderNumber: "",
    category: "Order Issue",
    subject: "",
    message: "",
    priority: "Normal",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ticketId: string } | null>(null);
  const [error, setError] = useState("");

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
    <Container sx={{ py: { xs: 4, md: 8 } }}>
      {/* Page header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={600}>
          Have a question or need help with your order? Fill out the form below and our
          team will get back to you within 1–2 business days.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* LEFT — form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{ p: { xs: 2.5, sm: 4 }, border: "1px solid", borderColor: "divider" }}
          >
            {result ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
                  Request Received ✓
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  Thank you! We've received your message.
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Your ticket reference number is:
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    display: "inline-block",
                    px: 3,
                    py: 1,
                    bgcolor: "primary.light",
                    color: "primary.main",
                    borderRadius: 2,
                    letterSpacing: 2,
                    mb: 3,
                  }}
                >
                  {result.ticketId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please save this reference number. A confirmation has been sent to your email.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 4 }}
                  onClick={() => {
                    setResult(null);
                    setForm({
                      name: "",
                      email: "",
                      orderNumber: "",
                      category: "Order Issue",
                      subject: "",
                      message: "",
                      priority: "Normal",
                    });
                  }}
                >
                  Submit Another Request
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Support Request
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Stack spacing={2.5}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        name="name"
                        label="Full Name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        name="email"
                        type="email"
                        label="Email Address"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        name="category"
                        label="Category"
                        value={form.category}
                        onChange={handleChange}
                      >
                        {CATEGORIES.map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        name="priority"
                        label="Priority"
                        value={form.priority}
                        onChange={handleChange}
                      >
                        {PRIORITIES.map((p) => (
                          <MenuItem key={p} value={p}>
                            {p}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    name="orderNumber"
                    label="Order Number (optional)"
                    placeholder="e.g. 1001"
                    value={form.orderNumber}
                    onChange={handleChange}
                  />

                  <TextField
                    fullWidth
                    name="subject"
                    label="Subject"
                    value={form.subject}
                    onChange={handleChange}
                  />

                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={5}
                    name="message"
                    label="Message *"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Please describe your issue in as much detail as possible…"
                  />

                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                  >
                    {loading ? "Submitting…" : "Submit Request"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Card>
        </Grid>

        {/* RIGHT — info sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Contact info */}
            <Card
              elevation={0}
              sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Get in Touch
              </Typography>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    info@prestigeapparelgroup.com
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Phone
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    1-630-479-8118
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mon–Fri 9 am – 5 pm CST
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Quick links */}
            <Card
              elevation={0}
              sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {[
                  { label: "Track Your Order", href: "/order-lookup" },
                  { label: "Start a Return", href: "/returns" },
                  { label: "Shipping Policy", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                ].map(({ label, href }) => (
                  <Typography
                    key={label}
                    component="a"
                    href={href}
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Stack>
            </Card>

            {/* FAQ */}
            <Card
              elevation={0}
              sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Frequently Asked
              </Typography>
              <Stack spacing={2} divider={<Divider />}>
                {FAQ.map(({ q, a }) => (
                  <Box key={q}>
                    <Typography variant="body2" fontWeight={600} mb={0.5}>
                      {q}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {a}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
