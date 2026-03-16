export const dynamic = "force-dynamic";

import type { PropsWithChildren } from "react";
import ShopLayout1 from "components/layouts/shop-layout-1";
import api from "utils/__api__/layout";

export default async function Layout1({ children }: PropsWithChildren) {
  const data = await api.getLayoutData();
  return <ShopLayout1 data={data}>{children}</ShopLayout1>;
<<<<<<< HEAD
}
=======
}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
