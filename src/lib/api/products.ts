import { shopifyFetch } from '../shopify';
import { GET_PRODUCT_BY_HANDLE } from '../queries/products';

export type FurnitureProduct = {
  id: string;
  title: string;
  description: string;
  vendor: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { url: string; altText: string | null }[];
  variants: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: { amount: string; currencyCode: string };
    selectedOptions: { name: string; value: string }[];
  }[];
  options: { id: string; name: string; values: string[] }[];
};

type ProductResponse = {
  productByHandle: {
    id: string;
    title: string;
    description: string;
    vendor: string;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: { node: { url: string; altText: string | null } }[] };
    variants: { edges: { node: { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string }; selectedOptions: { name: string; value: string }[] } }[] };
    options: { id: string; name: string; values: string[] }[];
  } | null;
};

export async function getProductByHandle(handle: string): Promise<FurnitureProduct | null> {
  const data = await shopifyFetch<ProductResponse>(GET_PRODUCT_BY_HANDLE, { handle });
  const p = data?.productByHandle;
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    vendor: p.vendor,
    priceRange: p.priceRange,
    images: p.images.edges.map((e) => e.node),
    variants: p.variants.edges.map((e) => e.node),
    options: p.options,
  };
}
