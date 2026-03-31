import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import { getStoreConfig } from "@/lib/storeResolver";

const getLayoutData = cache(async () => {
  const { storeId } = getStoreConfig();

  const data = await storefrontQuery(
    `query {
      collections(first: 50, sortKey: TITLE) {
        edges { node { id title handle
          products(first: 1) { edges { node { tags } } }
        } }
      }
    }`,
    {}
  );

  const storeCollections = data.collections.edges
    .filter(({ node }: any) =>
      node.products?.edges?.[0]?.node?.tags?.includes(storeId)
    )
    .map(({ node }: any) => ({
      id: node.id, title: node.title, handle: node.handle,
    }));

  return { collections: storeCollections };
});

export default { getLayoutData };
