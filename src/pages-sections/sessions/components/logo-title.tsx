import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Our Store";

export default function LogoWithTitle() {
  return (
    <FlexRowCenter flexDirection="column" gap={1} mb={4}>
      <Typography fontWeight={700} variant="h4" textAlign="center">
        Welcome To {storeName}
      </Typography>
    </FlexRowCenter>
  );
}
