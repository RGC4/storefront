import Image from "next/image";
import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";

export default function LogoWithTitle() {
  return (
    <FlexRowCenter flexDirection="column" gap={2} mb={4}>
      <Image
        width={160}
        height={54}
        src="/assets/stores/s1/logo/logo-header.png"
        alt="Prestige Apparel Group"
        style={{ objectFit: "contain" }}
      />
      <Typography fontWeight={600} variant="h5">
        Welcome To Prestige Apparel Group
      </Typography>
    </FlexRowCenter>
  );
}
