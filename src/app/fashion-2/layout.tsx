import { headers } from "next/headers";
import { getStoreConfig } from "@/lib/store-config";
import { getLayoutData } from "utils/__api__/layout";
import ShopLayout1 from "components/layouts/shop-layout-1/shop-layout-1";

export default async function Fashion2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get store ID injected by middleware
  const headersList = await headers();
  const storeId = headersList.get("x-store-id") || "s1";

  // Fetch store config from Vercel Blob
  const storeConfig = await getStoreConfig(storeId);

  // Fetch layout data (nav, footer, etc.)
  const layoutData = await getLayoutData();

  return (
    <ShopLayout1 data={layoutData} storeConfig={storeConfig}>
      {children}
    </ShopLayout1>
  );
}
