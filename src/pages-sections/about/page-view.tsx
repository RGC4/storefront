// src/pages-sections/about/page-view.tsx
"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "next/link";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Imperial Accessories";
const aboutSpecialty = process.env.NEXT_PUBLIC_ABOUT_SPECIALTY || "premium Italian-crafted luxury handbags";
const aboutProducts = process.env.NEXT_PUBLIC_ABOUT_PRODUCTS || "luxury handbags";
const aboutFocus = process.env.NEXT_PUBLIC_ABOUT_FOCUS || "timeless Italian-made luxury handbags built to last";
const bodyFontSize = "1.15rem";

export default function AboutPageView() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 9 } }}>

      <Typography
        variant="h1"
        sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, fontWeight: 700, textAlign: "center", mb: 1 }}
      >
        About Us
      </Typography>

      <Box sx={{ width: 56, height: 3, backgroundColor: "#b8972e", mx: "auto", mb: 2, borderRadius: 2 }} />

      <Typography
        sx={{ textAlign: "center", color: "text.secondary", fontSize: bodyFontSize, maxWidth: 680, mx: "auto", mb: 6, lineHeight: 1.8 }}
      >
        We believe luxury fashion should be accessible — beautifully made, honestly priced, and delivered with care.
      </Typography>

      <Divider sx={{ mb: 5 }} />

      <Section title="Who We Are">
        {storeName} is a U.S.-based online boutique specializing in premium Italian-crafted apparel and
        accessories. We curate pieces from trusted artisan suppliers — handbags, footwear, and ready-to-wear — and
        bring them directly to customers who appreciate quality and craftsmanship.
      </Section>

      <Box
        sx={{
          borderLeft: "4px solid #b8972e",
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

      <Section title="Based in the United States">
        We are a U.S.-based company operated by RGC4. Our customer service team is here to support you —
        before, during, and after your purchase.
      </Section>

      <Divider sx={{ mt: 5, mb: 3 }} />

      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontSize: bodyFontSize, color: "text.secondary", mb: 1 }}>
          We&apos;d love to hear from you.
        </Typography>
        <Typography sx={{ fontSize: bodyFontSize }}>
          Visit our{" "}
          <Link href="/contact" style={{ color: "#b8972e", fontWeight: 600, textDecoration: "none" }}>
            contact page
          </Link>{" "}
          or email us at{" "}
          <a href="mailto:corporate@prestigeapparelgroup.com" style={{ color: "#b8972e", fontWeight: 600 }}>
            corporate@prestigeapparelgroup.com
          </a>
        </Typography>
      </Box>

    </Container>
  );
}

// Fix: use div instead of p so ul can nest inside without hydration error
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




