import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeProvider from "theme/theme-provider";
import CartProvider from "contexts/CartContext";
import SettingsProvider from "contexts/SettingContext";
import RTL from "components/rtl";
import ProgressBar from "components/progress";
import { getLayoutData } from "utils/__api__/layout";
import ShopLayout1 from "components/layouts/shop-layout-1/shop-layout-1";
import "overlayscrollbars/overlayscrollbars.css";
import "i18n";

export const geist = Geist({ subsets: ["latin"] });

export default async function RootLayout({ children }: { children: ReactNode }) {
  const layoutData = await getLayoutData();
  return (
    <html lang="en">
      <body className={geist.className}>
        <SettingsProvider>
          <CartProvider>
            <ThemeProvider>
              <RTL>
                <ProgressBar />
                <ShopLayout1 data={layoutData}>
                  {children}
                </ShopLayout1>
              </RTL>
            </ThemeProvider>
          </CartProvider>
        </SettingsProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
