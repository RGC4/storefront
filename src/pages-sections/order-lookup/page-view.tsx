// DESTINATION: src/pages-sections/order-lookup/page-view.tsx
"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import BackButton from "components/BackButton";

const bodyText = { fontSize: { xs: "15px", md: "17px" }, lineHeight: 1.75 };
const sxInput  = { "& .MuiInputBase-input": { fontSize: { xs: "15px", md: "17px" } }, "& .MuiInputLabel-root": { fontSize: { xs: "15px", md: "17px" } }, "& .MuiFormHelperText-root": { fontSize: "14px" } };

type OrderResult = {
  id: string; name: string; email: string; createdAt: string;
  financialStatus: string; fulfillmentStatus: string;
  totalPrice: string; currency: string;
  lineItems: { title: string; quantity: number; price: string; variantTitle?: string }[];
  shippingAddress: { name: string; address1: string; city: string; province: string; zip: string; country: string } | null;
  statusUrl: string | null;
} | null;

function statusColor(status: string): "success" | "warning" | "error" | "default" {
  const s = status?.toLowerCase();
  if (s === "paid" || s === "fulfilled") return "success";
  if (s === "pending" || s === "partially_fulfilled") return "warning";
  if (s === "refunded" || s === "voided") return "error";
  return "default";
}

function formatStatus(s: string) {
  return s?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—";
}

export default function OrderLookupPageView() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult>(undefined as any);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true); setSearched(false);
    try {
      const res = await fetch("/api/order-lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderNumber, email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed.");
      setOrder(data.order); setSearched(true);
    } catch (err: any) { setError(err.message || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <BackButton />
      <Box mb={5}>
        <Typography sx={{ fontSize: { xs: "26px", md: "34px" }, fontWeight: 700, mb: 1 }}>Track Your Order</Typography>
        <Typography sx={{ ...bodyText, color: "text.secondary" }}>
          Enter your order number and the email address used at checkout to view your order status.
        </Typography>
      </Box>

      <Card elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, border: "1px solid", borderColor: "divider", mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField fullWidth required label="Order Number" placeholder="e.g. 1001" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} helperText="Found in your order confirmation email" sx={sxInput} />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField fullWidth required type="email" label="Email Address" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} helperText="Email used at checkout" sx={sxInput} />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <Button fullWidth size="large" type="submit" variant="contained" disabled={loading} sx={{ height: 56, fontSize: "16px" }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : "Find"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3, fontSize: "15px" }}>{error}</Alert>}

      {searched && !order && !error && (
        <Alert severity="warning" sx={{ mb: 3, fontSize: "15px" }}>
          No order found matching that order number and email. Please check your details and try again.{" "}
          Need help? <a href="/contact" style={{ color: "inherit", fontWeight: 600 }}>Contact us</a>.
        </Alert>
      )}

      {order && (
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ p: 3, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 8 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: 700 }}>Order {order.name}</Typography>
                <Typography sx={{ ...bodyText, color: "text.secondary" }}>
                  Placed {new Date(order.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { sm: "right" } }}>
                <Box display="flex" gap={1} justifyContent={{ sm: "flex-end" }} flexWrap="wrap">
                  <Chip size="small" label={formatStatus(order.financialStatus)} color={statusColor(order.financialStatus)} />
                  <Chip size="small" label={formatStatus(order.fulfillmentStatus || "unfulfilled")} color={statusColor(order.fulfillmentStatus)} variant="outlined" />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography sx={{ fontSize: "16px", fontWeight: 700, mb: 2 }}>Items Ordered</Typography>
            <Box component="table" width="100%" sx={{ borderCollapse: "collapse" }}>
              <Box component="thead">
                <Box component="tr" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  {["Product", "Variant", "Qty", "Price"].map((h) => (
                    <Box component="th" key={h} sx={{ py: 1, textAlign: "left", fontSize: "14px", fontWeight: 700, color: "text.secondary", pr: 2 }}>{h}</Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {order.lineItems.map((item, i) => (
                  <Box component="tr" key={i} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box component="td" sx={{ py: 1.5, pr: 2, fontSize: "16px" }}>{item.title}</Box>
                    <Box component="td" sx={{ py: 1.5, pr: 2, fontSize: "16px", color: "text.secondary" }}>{item.variantTitle || "—"}</Box>
                    <Box component="td" sx={{ py: 1.5, pr: 2, fontSize: "16px" }}>{item.quantity}</Box>
                    <Box component="td" sx={{ py: 1.5, fontSize: "16px" }}>${parseFloat(item.price).toFixed(2)}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Typography sx={{ ...bodyText, color: "text.secondary" }}>
                Order Total: <strong>{order.currency} ${parseFloat(order.totalPrice).toFixed(2)}</strong>
              </Typography>
            </Box>
          </Box>

          {order.shippingAddress && (
            <>
              <Divider />
              <Box sx={{ p: 3 }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, mb: 1 }}>Shipping To</Typography>
                <Typography sx={{ ...bodyText, color: "text.secondary" }}>
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.address1}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}<br />
                  {order.shippingAddress.country}
                </Typography>
              </Box>
            </>
          )}

          <Divider />
          <Box sx={{ p: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            {order.statusUrl && <Button variant="contained" size="small" href={order.statusUrl} target="_blank" rel="noopener" sx={{ fontSize: "15px" }}>View Full Order Status</Button>}
            <Button variant="outlined" size="small" href="/returns" sx={{ fontSize: "15px" }}>Start a Return</Button>
            <Button variant="outlined" size="small" href="/contact" sx={{ fontSize: "15px" }}>Contact Support</Button>
          </Box>
        </Card>
      )}
    </Container>
  );
}
