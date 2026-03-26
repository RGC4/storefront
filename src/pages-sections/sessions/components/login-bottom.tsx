import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";

export default function LoginBottom() {
  return (
    <FlexRowCenter gap={1} my={2}>
      <Typography variant="body2" color="text.secondary" textAlign="center" fontSize="1.1rem">
        Secure, passwordless sign-in powered by Shopify
      </Typography>
    </FlexRowCenter>
  );
}
