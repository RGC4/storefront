import { cache } from "react";
import { storefrontQuery, getStoreConfig } from "@/lib/storeResolver";

const getLayoutData = cache(async () => {
  const { storeId } = await getStoreConfig();

  const data = await storefrontQuery(
    `query {
      collections(first: 50, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            products(first: 1) {
              edges {
                node {
                  tags
                }
              }
            }
          }
        }
      }
    }`,
    {}
  );

  // Only show collections whose products have this store's tag
  const storeCollections = data.collections.edges
    .filter(({ node }: any) => {
      const firstProduct = node.products?.edges?.[0]?.node;
      if (!firstProduct) return false;
      return firstProduct.tags?.includes(storeId);
    })
    .map(({ node }: any) => ({
      id:     node.id,
      title:  node.title,
      handle: node.handle,
    }));

  return { collections: storeCollections };
});

export default { getLayoutData };
