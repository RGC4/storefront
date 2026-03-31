import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const geist = Geist({
  subsets: ["latin"]
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

export default function RootLayout({ children, modal }: RootLayoutProps) {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="xPe6mYQNmkBfZaSR4_IDNrpNR_-KymGUKhlNdlFU-Ng" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={storeName} />
        <meta name="format-detection" content="telephone=no" />
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
