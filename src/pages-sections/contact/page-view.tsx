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
import BackButton from "components/BackButton";

const CATEGORIES = ["Order Issue","Return / Exchange","Shipping & Delivery","Product Question","Billing & Payment","Other"];
const PRIORITIES = ["Normal", "High", "Urgent"];
const FAQ = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5 to 10 business days depending on destination." },
  { q: "What is your return policy?", a: "We accept returns within 10 business days of delivery. Items must be unused and in original packaging with all tags." },
  { q: "How do I track my order?", a: "Use the Order Lookup page with your order number and email address." },
  { q: "Are all items authentic?", a: "Yes. Every item sold by Prestige Apparel Group is 100% authentic and sourced directly from authorized distributors." },
];

const bodyText  = { fontSize: { xs: "15px", md: "17px" }, lineHeight: 1.75 };
const labelText = { fontSize: { xs: "15px", md: "17px" }, fontWeight: 600 };
const sxInput   = { "& .MuiInputBase-input": { fontSize: { xs: "15px", md: "17px" } }, "& .MuiInputLabel-root": { fontSize: { xs: "15px", md: "17px" } }, "& .MuiFormHelperText-root": { fontSize: "14px" } };

export default function ContactPageView() {
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", category: "Order Issue", subject: "", message: "", priority: "Normal" });
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
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setResult({ ticketId: data.ticketId });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <Container sx={{ py: { xs: 4, md: 8 } }}>
      <BackButton />
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: { xs: "26px", md: "34px" }, fontWeight: 700, mb: 1 }}>Contact Us</Typography>
        <Typography sx={{ ...bodyText, color: "text.secondary", maxWidth: 600 }}>
          Have a question or need help with your order? Fill out the form below and our team will get back to you within 1 to 2 business days.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, border: "1px solid", borderColor: "divider" }}>
            {result ? (
              <Box textAlign="center" py={4}>
                <Typography sx={{ fontSize: "22px", fontWeight: 700, mb: 1, color: "primary.main" }}>Request Received</Typography>
                <Typography sx={{ ...bodyText, color: "text.secondary", mb: 2 }}>Thank you! We have received your message.</Typography>
                <Typography sx={{ ...bodyText, color: "text.secondary", mb: 3 }}>Your ticket reference number is:</Typography>
                <Typography sx={{ display: "inline-block", px: 3, py: 1, bgcolor: "primary.light", color: "primary.main", borderRadius: 2, letterSpacing: 2, mb: 3, fontSize: "20px", fontWeight: 700 }}>
                  {result.ticketId}
                </Typography>
                <Typography sx={{ ...bodyText, color: "text.secondary" }}>Please save this reference number. A confirmation has been sent to your email.</Typography>
                <Button variant="outlined" sx={{ mt: 4, fontSize: "15px" }} onClick={() => { setResult(null); setForm({ name: "", email: "", orderNumber: "", category: "Order Issue", subject: "", message: "", priority: "Normal" }); }}>
                  Submit Another Request
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: 600, mb: 3 }}>Support Request</Typography>
                {error && <Alert severity="error" sx={{ mb: 3, fontSize: "15px" }}>{error}</Alert>}
                <Stack spacing={2.5}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required name="name" label="Full Name" value={form.name} onChange={handleChange} sx={sxInput} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required name="email" type="email" label="Email Address" value={form.email} onChange={handleChange} sx={sxInput} /></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField select fullWidth name="category" label="Category" value={form.category} onChange={handleChange} sx={sxInput}>
                        {CATEGORIES.map((c) => <MenuItem key={c} value={c} sx={{ fontSize: "16px" }}>{c}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField select fullWidth name="priority" label="Priority" value={form.priority} onChange={handleChange} sx={sxInput}>
                        {PRIORITIES.map((p) => <MenuItem key={p} value={p} sx={{ fontSize: "16px" }}>{p}</MenuItem>)}
                      </TextField>
                    </Grid>
                  </Grid>
                  <TextField fullWidth name="orderNumber" label="Order Number (optional)" placeholder="e.g. 1001" value={form.orderNumber} onChange={handleChange} sx={sxInput} />
                  <TextField fullWidth name="subject" label="Subject" value={form.subject} onChange={handleChange} sx={sxInput} />
                  <TextField fullWidth required multiline rows={5} name="message" label="Message" value={form.message} onChange={handleChange} placeholder="Please describe your issue in as much detail as possible." sx={sxInput} />
                  <Button fullWidth size="large" type="submit" variant="contained" disabled={loading} sx={{ fontSize: "16px", py: 1.75 }} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 2 }}>Get in Touch</Typography>
              <Stack spacing={1.5}>
                <Box><Typography sx={labelText}>Email</Typography><Typography sx={{ ...bodyText, color: "text.secondary" }}>corporate@prestigeapparelgroup.com</Typography></Box>
                <Box><Typography sx={labelText}>Phone</Typography><Typography sx={{ ...bodyText, color: "text.secondary" }}>1-630-479-8118</Typography></Box>
                <Box><Typography sx={labelText}>Hours</Typography><Typography sx={{ ...bodyText, color: "text.secondary" }}>Mon to Fri 9 am to 5 pm CST</Typography></Box>
              </Stack>
            </Card>
            <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 2 }}>Quick Links</Typography>
              <Stack spacing={1}>
                {[
                  { label: "Track Your Order", href: "/order-lookup" },
                  { label: "Start a Return", href: "/returns" },
                  { label: "Shipping Policy", href: "/policies/s1_shipping_policy.html" },
                  { label: "Privacy Policy", href: "/policies/s1_privacy_policy.html" },
                ].map(({ label, href }) => (
                  <Typography key={label} component="a" href={href} sx={{ ...bodyText, color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>{label}</Typography>
                ))}
              </Stack>
            </Card>
            <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 2 }}>Frequently Asked</Typography>
              <Stack spacing={2} divider={<Divider />}>
                {FAQ.map(({ q, a }) => (
                  <Box key={q}>
                    <Typography sx={{ ...labelText, mb: 0.5 }}>{q}</Typography>
                    <Typography sx={{ ...bodyText, color: "text.secondary" }}>{a}</Typography>
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
