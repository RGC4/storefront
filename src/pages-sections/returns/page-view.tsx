// src/pages-sections/returns/page-view.tsx
"use client";

import { useState, useRef } from "react";
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
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import BackButton from "components/BackButton";

interface OrderResult {
  id: string;
  name: string;
  date: string;
  items: { title: string; variantTitle: string; quantity: number }[];
  status: string;
  financial: string;
}

const RETURN_REASONS = ["Item not as described","Wrong item received","Damaged / defective","Changed my mind","Size / fit issue","Other"];
const RESOLUTIONS = ["Refund to original payment method", "Store credit"];
const PHOTO_REASONS = ["Damaged / defective", "Wrong item received", "Item not as described"];

const bodyText  = { fontSize: { xs: "15px", md: "17px" }, lineHeight: 1.75 };
const labelText = { fontSize: { xs: "15px", md: "17px" }, fontWeight: 600 };
const sxInput   = { "& .MuiInputBase-input": { fontSize: { xs: "15px", md: "17px" } }, "& .MuiInputLabel-root": { fontSize: { xs: "15px", md: "17px" } }, "& .MuiFormHelperText-root": { fontSize: "14px" } };

export default function ReturnsPageView() {
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", itemDescription: "", reason: "Item not as described", resolution: "Refund to original payment method", message: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ticketId: string } | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Order lookup state
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [orderItems, setOrderItems] = useState<{ title: string; variantTitle: string }[]>([]);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);
  const lastLookupEmail = useRef("");

  const showPhotoUpload = PHOTO_REASONS.includes(form.reason);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); setPhotos((prev) => [...prev, ...files].slice(0, 5)); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  // Look up orders when email field loses focus
  const handleEmailBlur = async () => {
    const email = form.email.trim();
    if (!email || !email.includes("@") || email === lastLookupEmail.current) return;
    lastLookupEmail.current = email;
    setLookingUp(true);
    setLookupDone(false);
    setOrders([]);
    setOrderItems([]);
    try {
      const res = await fetch("/api/orders-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      const foundOrders: OrderResult[] = data.orders || [];
      setOrders(foundOrders);
      setLookupDone(true);

      if (foundOrders.length === 1) {
        // Auto-fill order number and items
        const order = foundOrders[0];
        setForm((prev) => ({ ...prev, orderNumber: order.name }));
        setOrderItems(order.items.map((i) => ({ title: i.title, variantTitle: i.variantTitle })));
        if (order.items.length === 1) {
          const item = order.items[0];
          setForm((prev) => ({
            ...prev,
            orderNumber: order.name,
            itemDescription: item.variantTitle ? `${item.title} — ${item.variantTitle}` : item.title,
          }));
        }
      }
    } catch {
      // Silently fail — user can still type manually
    } finally {
      setLookingUp(false);
    }
  };

  // When user picks an order from dropdown
  const handleOrderSelect = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const orderName = e.target.value;
    setForm((prev) => ({ ...prev, orderNumber: orderName, itemDescription: "" }));
    const selected = orders.find((o) => o.name === orderName);
    if (selected) {
      setOrderItems(selected.items.map((i) => ({ title: i.title, variantTitle: i.variantTitle })));
      if (selected.items.length === 1) {
        const item = selected.items[0];
        setForm((prev) => ({
          ...prev,
          itemDescription: item.variantTitle ? `${item.title} — ${item.variantTitle}` : item.title,
        }));
      }
    } else {
      setOrderItems([]);
    }
  };

  // When user picks an item from dropdown
  const handleItemSelect = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, itemDescription: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("orderNumber", form.orderNumber);
      formData.append("item", form.itemDescription);
      formData.append("reason", form.reason);
      formData.append("resolution", form.resolution);
      formData.append("notes", form.message);
      photos.forEach((file) => formData.append("photos", file));
      const res = await fetch("/api/returns", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setResult({ ticketId: data.ticketId });
    } catch (err: any) { setError(err.message || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  // Format order date for display
  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return ""; }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <BackButton />
      <Box mb={4}>
        <Typography sx={{ fontSize: { xs: "26px", md: "34px" }, fontWeight: 700, mb: 1 }}>Returns & Exchanges</Typography>
        <Typography sx={{ ...bodyText, color: "text.secondary", maxWidth: 580 }}>
          We want you to love what you receive. If something is not quite right, we will make it easy — just fill out the form and we will take it from there.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, border: "1px solid", borderColor: "divider" }}>
            {result ? (
              <Box textAlign="center" py={4}>
                <Typography sx={{ fontSize: "22px", fontWeight: 700, mb: 1, color: "primary.main" }}>Return Request Submitted</Typography>
                <Typography sx={{ ...bodyText, color: "text.secondary", mb: 2 }}>We have received your request and will be in touch within 1 to 2 business days with next steps, including your prepaid return shipping label.</Typography>
                <Typography sx={{ ...bodyText, color: "text.secondary", mb: 1 }}>Your reference number:</Typography>
                <Typography sx={{ display: "inline-block", px: 3, py: 1, bgcolor: "primary.light", color: "primary.main", borderRadius: 2, letterSpacing: 2, mb: 3, fontSize: "20px", fontWeight: 700 }}>{result.ticketId}</Typography>
                <Typography sx={{ ...bodyText, color: "text.secondary" }}>A confirmation email has been sent to you. Please hold onto your item and do not ship anything back until you receive your return label and instructions from us.</Typography>
                <Button variant="outlined" sx={{ mt: 4, fontSize: "15px" }} href="/">Continue Shopping</Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: 600, mb: 2.5 }}>Return Request Form</Typography>
                {error && <Alert severity="error" sx={{ mb: 2.5, fontSize: "15px" }}>{error}</Alert>}
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required name="name" label="Full Name" value={form.name} onChange={handleChange} sx={sxInput} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth required name="email" type="email" label="Email Address"
                        value={form.email} onChange={handleChange} onBlur={handleEmailBlur}
                        helperText={lookingUp ? "Looking up your orders..." : lookupDone && orders.length === 0 ? "No orders found — you can enter details manually" : "Enter the email used for your order"}
                        sx={sxInput}
                        slotProps={{
                          input: {
                            endAdornment: lookingUp ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {orders.length > 1 ? (
                        <TextField
                          select fullWidth required name="orderNumber" label="Select Your Order"
                          value={form.orderNumber} onChange={handleOrderSelect} sx={sxInput}
                        >
                          {orders.map((o) => (
                            <MenuItem key={o.id} value={o.name} sx={{ fontSize: "16px" }}>
                              {o.name} — {formatDate(o.date)} ({o.items.length} item{o.items.length !== 1 ? "s" : ""})
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <TextField
                          fullWidth required name="orderNumber" label="Order Number" placeholder="e.g. #1001"
                          value={form.orderNumber} onChange={handleChange}
                          helperText="Found in your order confirmation email"
                          sx={sxInput}
                        />
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      {orderItems.length > 1 ? (
                        <TextField
                          select fullWidth required name="itemDescription" label="Which Item?"
                          value={form.itemDescription} onChange={handleItemSelect} sx={sxInput}
                        >
                          {orderItems.map((item, i) => {
                            const label = item.variantTitle ? `${item.title} — ${item.variantTitle}` : item.title;
                            return <MenuItem key={i} value={label} sx={{ fontSize: "16px" }}>{label}</MenuItem>;
                          })}
                        </TextField>
                      ) : (
                        <TextField
                          fullWidth required name="itemDescription" label="Item Name / Description"
                          placeholder="e.g. Black Leather Tote Bag"
                          value={form.itemDescription} onChange={handleChange} sx={sxInput}
                        />
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField select fullWidth name="reason" label="Return Reason" value={form.reason} onChange={handleChange} sx={sxInput}>
                        {RETURN_REASONS.map((r) => <MenuItem key={r} value={r} sx={{ fontSize: "16px" }}>{r}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField select fullWidth name="resolution" label="Preferred Resolution" value={form.resolution} onChange={handleChange} sx={sxInput}>
                        {RESOLUTIONS.map((r) => <MenuItem key={r} value={r} sx={{ fontSize: "16px" }}>{r}</MenuItem>)}
                      </TextField>
                    </Grid>
                  </Grid>
                  <TextField fullWidth multiline rows={5} name="message" label="Additional Notes (optional)" value={form.message} onChange={handleChange} placeholder="Tell us a little more about the issue." sx={sxInput} />

                  {showPhotoUpload && (
                    <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 2, p: 2.5, bgcolor: "grey.50" }}>
                      <Typography sx={{ ...labelText, mb: 0.5 }}>Add Photos</Typography>
                      <Typography sx={{ ...bodyText, color: "text.secondary", mb: 1.5 }}>A picture really helps — please include clear photos of the item, the tag, and the issue. You can upload up to 5 images (JPG, PNG).</Typography>
                      {photos.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                          {photos.map((file, i) => (
                            <Box key={i} sx={{ position: "relative", width: 72, height: 72, borderRadius: 1, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
                              <Box component="img" src={URL.createObjectURL(file)} alt={`photo-${i}`} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <IconButton size="small" onClick={() => removePhoto(i)} sx={{ position: "absolute", top: 1, right: 1, bgcolor: "rgba(0,0,0,0.55)", color: "#fff", p: "2px", "&:hover": { bgcolor: "rgba(0,0,0,0.75)" } }}>X</IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display: "none" }} onChange={handlePhotoChange} />
                      <Button variant="outlined" size="small" disabled={photos.length >= 5} onClick={() => fileInputRef.current?.click()} sx={{ fontSize: "14px" }}>
                        {photos.length === 0 ? "Choose Photos" : `Add More (${photos.length}/5)`}
                      </Button>
                    </Box>
                  )}

                  <Button fullWidth size="large" type="submit" variant="contained" disabled={loading} sx={{ fontSize: "16px", py: 1.75 }} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
                    {loading ? "Submitting..." : "Submit Return Request"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2.5}>
            <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 2 }}>The Basics</Typography>
              <Stack spacing={1.5} divider={<Divider />}>
                {[
                  { label: "7 Business Days", value: "Submit your request within 7 business days of receiving your order." },
                  { label: "Free Return Shipping", value: "We will email you a prepaid return label — no need to arrange anything yourself." },
                  { label: "Original Condition", value: "Items should be unworn and unwashed, with all tags, boxes, and dust bags included." },
                  { label: "Refunds", value: "Once we receive and check your return, your refund is on its way within 5 business days." },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography sx={labelText}>{label}</Typography>
                    <Typography sx={{ ...bodyText, color: "text.secondary" }}>{value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
            <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 1.5 }}>A Few Things to Keep in Mind</Typography>
              <Stack spacing={1.5} divider={<Divider />}>
                {[
                  { label: "Wrong or damaged item?", value: "Just include a couple of clear photos with your request and we will sort it out for you straight away." },
                  { label: "Want a different size or style?", value: "Simply place a new order for what you would like, then submit a return for your original item. Once we receive it back, your refund will follow within 5 business days." },
                  { label: "Package not arrived?", value: "Please let us know within 14 days of your shipping confirmation and we will look into it right away." },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography sx={{ ...labelText, mb: 0.5 }}>{label}</Typography>
                    <Typography sx={{ ...bodyText, color: "text.secondary" }}>{value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
            <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 1 }}>We Are Here to Help</Typography>
              <Typography sx={{ ...bodyText, color: "text.secondary", mb: 2 }}>Any questions at all? Our team is just a message away.</Typography>
              <Button variant="outlined" fullWidth href="/contact" sx={{ fontSize: "15px" }}>Contact Us</Button>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
