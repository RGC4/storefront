// src/app/layout.tsx
// FIXES: Adds Organization JSON-LD schema for Google Knowledge Panel

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const geist = Geist({
  subsets: ["latin"],
});

import "overlayscrollbars/overlayscrollbars.css";
import ThemeProvider from "theme/theme-provider";
import CartProvider from "contexts/CartContext";
import SettingsProvider from "contexts/SettingContext";
import RTL from "components/rtl";
import ProgressBar from "components/progress";
import "i18n";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com";

// ── Global metadata defaults ────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${STORE_NAME} — Luxury Designer Bags & Fashion`,
    template: `%s | ${STORE_NAME}`,
  },
  description: `Shop authentic luxury designer bags, clutches, totes and more at ${STORE_NAME}. Curated collection at competitive prices.`,
  openGraph: {
    type: "website",
    siteName: STORE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

// Organization JSON-LD for Google Knowledge Panel
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: STORE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/assets/images/logo.svg`,
  description: `${STORE_NAME} offers a curated collection of authentic luxury designer bags and fashion at competitive prices.`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: `${BASE_URL}/contact`,
  },
  sameAs: [
    // Add your social media URLs here when available
    // "https://www.instagram.com/prestigeapparelgroup",
    // "https://www.facebook.com/prestigeapparelgroup",
    // "https://www.tiktok.com/@prestigeapparelgroup",
  ].filter(Boolean),
};

// WebSite JSON-LD for sitelinks search box
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: STORE_NAME,
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="xPe6mYQNmkBfZaSR4_IDNrpNR_-KymGUKhlNdlFU-Ng"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={STORE_NAME} />
        <meta name="format-detection" content="telephone=no" />

        {/* Organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        {/* WebSite schema with search action */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <style>{`
          * { -webkit-tap-highlight-color: transparent; }
          body {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          }
        `}</style>
      </head>
      <body id="body" className={geist.className}>
        <CartProvider>
          <SettingsProvider>
            <ThemeProvider>
              <RTL>
                {modal}
                {children}
              </RTL>
              <ProgressBar />
            </ThemeProvider>
          </SettingsProvider>
        </CartProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
