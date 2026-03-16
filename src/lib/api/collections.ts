import { shopifyFetch, ShopifyCollection } from '../shopify';
import { GET_ALL_COLLECTIONS } from '../queries/collections';

type CollectionsResponse = {
  collections: { edges: { node: ShopifyCollection }[] };
};

export async function getAllCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<CollectionsResponse>(GET_ALL_COLLECTIONS, { first });
  return data.collections.edges.map(({ node }) => node);
}
