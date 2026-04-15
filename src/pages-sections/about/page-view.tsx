// src/pages-sections/about/page-view.tsx
"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "next/link";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Imperial Accessories";
const storeEmail = process.env.NEXT_PUBLIC_STORE_EMAIL || "corporate@imperialaccessories.com";
const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#b8972e";
const aboutSpecialty = process.env.NEXT_PUBLIC_ABOUT_SPECIALTY || "premium Italian-crafted luxury handbags";
const aboutProducts = process.env.NEXT_PUBLIC_ABOUT_PRODUCTS || "luxury handbags";
const aboutFocus = process.env.NEXT_PUBLIC_ABOUT_FOCUS || "timeless Italian-made luxury handbags built to last";
const bodyFontSize = "1.15rem";

export default function AboutPageView() {
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
            About Us
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
            We believe luxury fashion should be accessible — beautifully made, honestly priced, and delivered with care.
          </Typography>
        </Container>
      </Box>

      {/* WHITE CONTENT AREA */}
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>

        <Section title="Who We Are">
          {storeName} is a U.S.-based online boutique specializing in {aboutSpecialty}. We curate pieces from
          trusted artisan suppliers — {aboutProducts} — and bring them directly to customers who appreciate
          quality and craftsmanship.
        </Section>

        <Box
          sx={{
            borderLeft: `4px solid ${primaryColor}`,
            pl: 3,
            py: 1.5,
            my: 4,
            backgroundColor: "#fdfaf4",
            borderRadius: "0 6px 6px 0",
          }}
        >
          <Typography sx={{ fontStyle: "italic", fontSize: bodyFontSize, color: "#444", lineHeight: 1.75 }}>
            &ldquo;Handcrafted in Italy. Curated for You.&rdquo; — Every piece in our collection is selected for its quality,
            its story, and the hands that made it.
          </Typography>
        </Box>

        <Section title="What We Offer">
          Our collection focuses on {aboutFocus}. We partner with established fulfillment networks to offer a broad
          selection while maintaining high standards for the items we carry.
        </Section>

        <Section title="Our Commitment to You">
          <Box component="ul" sx={{ pl: 3, mt: 1, "& li": { mb: 1, fontSize: bodyFontSize, color: "text.secondary" } }}>
            <li>Honest product descriptions and accurate photography.</li>
            <li>Transparent pricing with no hidden fees at checkout.</li>
            <li>Responsive customer support for every order.</li>
            <li>A returns process that is fair and straightforward.</li>
          </Box>
        </Section>

        <Section title="Our Story">
          {storeName} was founded with a simple idea: bring the quality of Italian boutique fashion to
          customers across the United States, without the markup of a traditional retail chain. We are a small,
          dedicated team committed to growing a store our customers can trust.
        </Section>

        <Divider sx={{ my: 5 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: bodyFontSize, color: "text.secondary", mb: 1 }}>
            We&apos;d love to hear from you.
          </Typography>
          <Typography sx={{ fontSize: bodyFontSize }}>
            Visit our{" "}
            <Link href="/contact" style={{ color: primaryColor, fontWeight: 600, textDecoration: "none" }}>
              contact page
            </Link>{" "}
            or email us at{" "}
            <a href={`mailto:${storeEmail}`} style={{ color: primaryColor, fontWeight: 600 }}>
              {storeEmail}
            </a>
          </Typography>
        </Box>

      </Container>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 1 }}>
        {title}
      </Typography>
      <Box sx={{ fontSize: "1.15rem", color: "text.secondary", lineHeight: 1.8 }}>
        {children}
      </Box>
    </Box>
  );
}
