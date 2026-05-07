// src/app/layout.tsx

import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import storeConfig from "config/store.config";

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

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

function resolveLogoUrl(): string {
  const logo = storeConfig.logo || "/assets/images/logo.svg";
  if (/^https?:\/\//i.test(logo)) return logo;
  return `${storeConfig.siteUrl}${logo.startsWith("/") ? logo : `/${logo}`}`;
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: storeConfig.name,
  url: storeConfig.siteUrl,
  logo: resolveLogoUrl(),
  ...(storeConfig.description ? { description: storeConfig.description } : {}),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: `${storeConfig.siteUrl}/contact`,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: storeConfig.name,
  url: storeConfig.siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${storeConfig.siteUrl}/products/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="xPe6mYQNmkBfZaSR4_IDNrpNR_-KymGUKhlNdlFU-Ng" />
        <meta name="p:domain_verify" content="084f13e279f0d2e678e89f529cf812c8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={storeConfig.name} />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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

          .hero-mobile  { display: block; }
          .hero-desktop { display: none;  }
          @media (min-width: 769px) {
            .hero-mobile  { display: none;  }
            .hero-desktop { display: block; }
          }
          .hero-slide {
            transition: opacity 600ms ease-in-out;
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