import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
<<<<<<< HEAD
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LockIcon from "@mui/icons-material/Lock";

export default function CreditCardForm() {
  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        {/* Card Number — full width */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="card_no"
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            inputProps={{ maxLength: 19 }}
          />
        </Grid>

        {/* Name on Card — full width */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="name"
            label="Name on Card"
            placeholder="John Smith"
          />
        </Grid>

        {/* Expiry + CVV side by side */}
        <Grid size={{ sm: 6, xs: 12 }}>
          <TextField
            fullWidth
            name="exp_date"
            label="Expiry Date"
            placeholder="MM / YY"
            inputProps={{ maxLength: 7 }}
          />
        </Grid>

        <Grid size={{ sm: 6, xs: 12 }}>
          <TextField
            fullWidth
            name="cvv"
            label="CVV"
            placeholder="123"
            inputProps={{ maxLength: 4 }}
          />
        </Grid>
      </Grid>

      <Box display="flex" alignItems="center" gap={0.5} mt={2}>
        <LockIcon sx={{ fontSize: 13, color: "text.secondary" }} />
        <Typography variant="caption" color="text.secondary">
          Your payment info is encrypted and never stored on our servers.
        </Typography>
      </Box>
    </Box>
=======

export default function CreditCardForm() {
  // const INITIAL_VALUES = {
  //   card_no: "",
  //   name: "",
  //   exp_date: "",
  //   cvc: "",
  //   shipping_zip: "",
  //   shipping_country: "",
  //   shipping_address1: "",
  //   shipping_address2: "",

  //   billing_name: "",
  //   billing_email: "",
  //   billing_contact: "",
  //   billing_company: "",
  //   billing_zip: "",
  //   billing_country: "",
  //   billing_address1: "",
  //   billing_address2: ""
  // };

  // const VALIDATION_SCHEMA = yup.object().shape({
  //   card_no: yup.string().required("required"),
  //   name: yup.string().required("required"),
  //   exp_date: yup.string().required("required"),
  //   cvc: yup.string().required("required")
  // });

  return (
    <form>
      <Grid container spacing={2} mt={1}>
        <Grid size={{ sm: 6, xs: 12 }}>
          <TextField fullWidth name="card_no" label="Card Number" />
        </Grid>

        <Grid size={{ sm: 6, xs: 12 }}>
          <TextField fullWidth name="exp_date" label="Exp Date" placeholder="MM/YY" />
        </Grid>

        <Grid size={{ sm: 6, xs: 12 }}>
          <TextField fullWidth name="name" label="Name on Card" />
        </Grid>

        <Grid size={{ sm: 6, xs: 12 }}>
          <TextField fullWidth name="name" label="Name on Card" />
        </Grid>

        <Grid size={{ sm: 6, xs: 12 }}>
          <Button variant="outlined" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  );
}
