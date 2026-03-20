import { notFound } from "next/navigation";
import { storefrontQuery } from "lib/shopify";
import CollectionView from "./CollectionView";

const COLLECTION_QUERY = `
  query CollectionByHandle($handle: String!, $cursor: String) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: 250, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id title handle vendor tags
            availableForSale
            featuredImage { url }
            priceRange { minVariantPrice { amount currencyCode } }
            compareAtPriceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  }
`;

function mapProduct(node: any) {
  const price = parseFloat(node.priceRange?.minVariantPrice?.amount ?? 0);
  const comparePrice = parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount ?? 0);
  return {
    id: node.id,
    slug: node.handle,
    title: node.title,
    vendor: node.vendor ?? "",
    price,
    comparePrice,
    discount: comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0,
    thumbnail: node.featuredImage?.url ?? "",
    tags: node.tags ?? [],
    availableForSale: node.availableForSale ?? true,
  };
}

async function fetchAllProducts(slug: string) {
  let allProducts: any[] = [];
  let cursor: string | null = null;
  let title = "";
  let description = "";

  do {
    const data = await storefrontQuery(COLLECTION_QUERY, {
      handle: slug,
      ...(cursor ? { cursor } : {}),
    }).catch(() => null);

    const col = data?.collection;
    if (!col) break;
    if (!title) { title = col.title; description = col.description ?? ""; }
    allProducts = [...allProducts, ...col.products.edges.map(({ node }: any) => mapProduct(node))];
    cursor = col.products.pageInfo.hasNextPage ? col.products.pageInfo.endCursor : null;
  } while (cursor);

  return { title, description, products: allProducts };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { title, description, products } = await fetchAllProducts(slug);
  if (!title) return notFound();
  return <CollectionView title={title} description={description} products={products} />;
}
