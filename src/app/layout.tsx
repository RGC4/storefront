import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getStoreConfig } from "@/lib/storeResolver";

export const geist = Geist({
  subsets: ["latin"]
});

import "overlayscrollbars/overlayscrollbars.css";

// THEME PROVIDER
import ThemeProvider from "theme/theme-provider";

// PRODUCT CART PROVIDER
import CartProvider from "contexts/CartContext";

// SITE SETTINGS PROVIDER
import SettingsProvider from "contexts/SettingContext";

// GLOBAL CUSTOM COMPONENTS
import RTL from "components/rtl";
import ProgressBar from "components/progress";

// IMPORT i18n SUPPORT FILE
import "i18n";

// ==============================================================
interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}
// ==============================================================

export async function generateMetadata(): Promise<Metadata> {
  const { storeName } = await getStoreConfig();
  return {
    title: storeName,
    description: `Shop at ${storeName}.`,
    authors: [{ name: storeName }],
  };
}

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const { storeName } = await getStoreConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="xPe6mYQNmkBfZaSR4_IDNrpNR_-KymGUKhlNdlFU-Ng" />

        {/* iPhone / iOS optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={storeName} />
        <meta name="format-detection" content="telephone=no" />

        {/* Safe area + Safari tap highlight fix */}
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

        {/* GA ID loaded from env — set NEXT_PUBLIC_GA_ID in your .env */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
