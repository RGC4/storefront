import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeProvider from "theme/theme-provider";
import CartProvider from "contexts/CartContext";
import SettingsProvider from "contexts/SettingContext";
import RTL from "components/rtl";
import ProgressBar from "components/progress";
import "overlayscrollbars/overlayscrollbars.css";
import "i18n";

export const geist = Geist({ subsets: ["latin"] });

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
