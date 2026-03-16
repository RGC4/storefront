import { getLayoutData } from "utils/__api__/layout";
import ShopLayout1 from "components/layouts/shop-layout-1/shop-layout-1";

export default async function Fashion2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layoutData = await getLayoutData();

  return (
    <ShopLayout1 data={layoutData}>
      {children}
    </ShopLayout1>
  );
}
