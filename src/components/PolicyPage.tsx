// src/components/PolicyPage.tsx
"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import type { PolicyData } from "@/lib/policyLoader";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#b8972e";

interface Props {
  policy: PolicyData;
}

export default function PolicyPage({ policy }: Props) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 9 } }}>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: 18,
          color: primaryColor,
          textDecoration: "none",
          fontSize: "1rem",
          fontWeight: 500,
        }}
      >
        &larr; Back to Store
      </Link>

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2rem", md: "2.6rem" },
          fontWeight: 700,
          textAlign: "center",
          mb: 1,
        }}
      >
        {policy.pageTitle}
      </Typography>

      <Box
        sx={{
          width: 56,
          height: 3,
          backgroundColor: primaryColor,
          mx: "auto",
          mb: 2,
          borderRadius: 2,
        }}
      />

      {policy.intro && (
        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontSize: "1.15rem",
            maxWidth: 680,
            mx: "auto",
            mb: 6,
            lineHeight: 1.8,
          }}
        >
          {policy.intro}
        </Typography>
      )}

      <Divider sx={{ mb: 5 }} />

      {policy.sections.map((section, i) => (
        <Box key={i} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 1 }}
          >
            {section.title}
          </Typography>

          <Box
            sx={{
              fontSize: "1.15rem",
              color: "text.secondary",
              lineHeight: 1.8,
              "& p": {
                fontSize: "1.15rem",
                color: "text.secondary",
                lineHeight: 1.8,
                mb: 2,
                mt: 0,
              },
              "& ul": {
                pl: 3,
                mt: 1,
              },
              "& li": {
                mb: 1,
                fontSize: "1.15rem",
                color: "text.secondary",
              },
              "& a": {
                color: primaryColor,
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
            }}
            dangerouslySetInnerHTML={{ __html: section.body }}
          />
        </Box>
      ))}

      <Divider sx={{ my: 5 }} />

      {policy.footer && (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "text.disabled", pt: 3 }}
        >
          {policy.footer}
        </Typography>
      )}
    </Container>
  );
}
