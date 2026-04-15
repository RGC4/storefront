// src/components/PolicyPage.tsx
"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Link from "next/link";
import type { PolicyData } from "@/lib/policyLoader";

const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#b8972e";

interface Props {
  policy: PolicyData;
}

export default function PolicyPage({ policy }: Props) {
  return (
    <>
      {/* DARK BANNER HEADER */}
      <Box
        sx={{
          bgcolor: "grey.900",
          color: "#fff",
          py: { xs: 5, md: 7 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          {/* BUTTON ROW */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: { xs: 4, md: 5 },
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              component={Link}
              href="/"
              variant="outlined"
              sx={{
                fontSize: "0.95rem",
                fontWeight: 600,
                textTransform: "none",
                borderColor: primaryColor,
                color: primaryColor,
                borderWidth: 2,
                px: 3,
                py: 1.1,
                borderRadius: 2,
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: primaryColor,
                  color: "#fff",
                  borderColor: primaryColor,
                  borderWidth: 2,
                },
              }}
            >
              <Box component="span" sx={{ mr: 1, fontSize: "1.1rem", fontWeight: 700 }}>
                &lt;
              </Box>
              Back to Store
            </Button>

            <Button
              component={Link}
              href="/contact"
              variant="contained"
              sx={{
                fontSize: "0.95rem",
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: primaryColor,
                color: "#fff",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: primaryColor,
                px: 3,
                py: 1.1,
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: primaryColor,
                  borderColor: primaryColor,
                  boxShadow: "none",
                },
              }}
            >
              Contact Us
            </Button>
          </Box>

          {/* PAGE TITLE */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 700,
              textAlign: "center",
              color: "#fff",
              mb: 2,
              lineHeight: 1.1,
            }}
          >
            {policy.pageTitle}
          </Typography>

          <Box
            sx={{
              width: 64,
              height: 4,
              backgroundColor: primaryColor,
              mx: "auto",
              mb: 3,
              borderRadius: 2,
            }}
          />

          {policy.intro && (
            <Typography
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.85)",
                fontSize: { xs: "1rem", md: "1.2rem" },
                maxWidth: 860,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              {policy.intro}
            </Typography>
          )}
        </Container>
      </Box>

      {/* WHITE CONTENT AREA */}
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
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
      </Container>
    </>
  );
}
