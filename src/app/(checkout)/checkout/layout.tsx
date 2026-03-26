// src/app/(checkout)/checkout/layout.tsx
import type { PropsWithChildren } from "react";
import Container from "@mui/material/Container";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {children}
    </Container>
  );
}
