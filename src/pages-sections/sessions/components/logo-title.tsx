import Typography from "@mui/material/Typography";
import FlexRowCenter from "components/flex-box/flex-row-center";

export default function LogoWithTitle() {
  return (
    <FlexRowCenter flexDirection="column" gap={1} mb={4}>
      <Typography fontWeight={700} variant="h2" textAlign="center" whiteSpace="nowrap">
        Welcome To Prestige Apparel Group
      </Typography>
    </FlexRowCenter>
  );
}
