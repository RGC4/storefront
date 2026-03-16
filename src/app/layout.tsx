import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const geist = Geist({
  subsets: ["latin"],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <SettingsProvider>
          <CartProvider>
            <ThemeProvider>
              <RTL>
                <ProgressBar />
                {children}
              </RTL>
            </ThemeProvider>
          </CartProvider>
        </SettingsProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
