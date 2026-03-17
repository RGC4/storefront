import type { PropsWithChildren } from "react";
import Container from "@mui/material/Container";
import Steppers from "../steppers";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4, px: { xs: 2, sm: 3, md: 4 }, overflowX: "hidden" }}>
      <Steppers />
      {children}
    </Container>
  );
}
