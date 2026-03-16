<<<<<<< HEAD
// DESTINATION: src/pages-sections/cart/checkout-form.tsx
"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import useCart from "hooks/useCart";
import { FlexBetween } from "components/flex-box";
import { currency } from "lib";

export default function CheckoutForm() {
  const { state } = useCart();
  const cart = state?.cart ?? [];

  const subtotal = cart.reduce((acc: number, item: any) => acc + item.price * item.qty, 0);
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + shipping;
=======
"use client";

// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
// DUMMY CUSTOM DATA
import countryList from "data/countryList";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

const STATE_LIST = [
  { value: "new-york", label: "New York" },
  { value: "chicago", label: "Chicago" }
];

export default function CheckoutForm() {
  const { state } = useCart();

  const getTotalPrice = () => state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b

  const handleCheckout = () => {
    if (state.checkoutUrl) {
      window.location.href = state.checkoutUrl;
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
<<<<<<< HEAD
        padding: { xs: 2, sm: 3 },
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        Order Summary
      </Typography>

      <FlexBetween mb={1}>
        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
        <Typography variant="body2" fontWeight={500}>{currency(subtotal)}</Typography>
      </FlexBetween>

      <FlexBetween mb={1}>
        <Typography variant="body2" color="text.secondary">Shipping</Typography>
        <Typography variant="body2" fontWeight={500} color={shipping === 0 ? "success.main" : "text.primary"}>
          {shipping === 0 ? "Free" : currency(shipping)}
        </Typography>
      </FlexBetween>

      {shipping > 0 && (
        <Box display="flex" alignItems="center" gap={0.5} mb={1}>
          <LocalShippingOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Add {currency(99 - subtotal)} more for free shipping
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <FlexBetween mb={3}>
        <Typography variant="body1" fontWeight={700}>Total</Typography>
        <Typography variant="h5" fontWeight={800}>{currency(total)}</Typography>
      </FlexBetween>

      <Button
        fullWidth
        size="large"
        color="primary"
        variant="contained"
        onClick={handleCheckout}
        disabled={!state.checkoutUrl || cart.length === 0}
        sx={{ py: 1.5 }}
      >
        Proceed to Checkout
      </Button>

      <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1.5}>
        Secure checkout powered by Shopify
      </Typography>
=======
        padding: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50"
      }}
    >
      <FlexBetween mb={2}>
        <Typography variant="body1" fontSize={16} fontWeight={600}>
          Total:
        </Typography>

        <Typography variant="body1" fontSize={18} fontWeight={600} lineHeight={1}>
          {currency(getTotalPrice())}
        </Typography>
      </FlexBetween>

      <Divider sx={{ mb: 2 }} />

      <FlexBox alignItems="center" columnGap={1} mb={2}>
        <Typography variant="body1" fontWeight={500}>
          Additional Comments
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: 12,
            lineHeight: 1,
            padding: "2px 6px",
            borderRadius: "3px",
            bgcolor: "grey.200"
          }}
        >
          Note
        </Typography>
      </FlexBox>

      {/* COMMENTS TEXT FIELD */}
      <TextField variant="outlined" rows={3} fullWidth multiline />

      {/* APPLY VOUCHER TEXT FIELD */}
      <FlexBox alignItems="center" gap={1} my={2}>
        <TextField
          fullWidth
          size="small"
          label="Voucher"
          variant="outlined"
          placeholder="Voucher"
        />

        <Button variant="outlined" color="primary">
          Apply
        </Button>
      </FlexBox>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
        Shipping Estimates
      </Typography>

      {/* COUNTRY TEXT FIELD */}
      <Autocomplete
        fullWidth
        sx={{ mb: 2 }}
        options={countryList}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Country"
            variant="outlined"
            placeholder="Select Country"
          />
        )}
      />

      {/* STATE/CITY TEXT FIELD */}
      <TextField
        select
        fullWidth
        size="small"
        label="State"
        variant="outlined"
        placeholder="Select State"
        defaultValue="new-york"
      >
        {STATE_LIST.map(({ label, value }) => (
          <MenuItem value={value} key={label}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      {/* ZIP-CODE TEXT FIELD */}
      <TextField
        fullWidth
        size="small"
        label="Zip Code"
        placeholder="3100"
        variant="outlined"
        sx={{ mt: 2 }}
      />

      <Button variant="outlined" color="primary" fullWidth sx={{ my: 2 }}>
        Calculate Shipping
      </Button>

      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={handleCheckout}
        disabled={!state.checkoutUrl || state.cart.length === 0}
      >
        Checkout Now
      </Button>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    </Card>
  );
}
