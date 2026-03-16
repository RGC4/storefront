import { cache } from "react";
<<<<<<< HEAD
import { storefrontQuery } from "lib/shopify";
import Product from "models/Product.model";

function mapProduct(p: any) {
  const price = parseFloat(p.priceRange?.minVariantPrice?.amount ?? 0);
  const images = p.images?.edges?.map((e: any) => e.node.url) ?? [];
  return {
    id: p.id, slug: p.handle, title: p.title, brand: p.vendor ?? null,
    price, comparePrice: 0, discount: 0, colors: [],
    thumbnail: images[0] ?? "", images,
    variants: p.variants?.edges?.map((e: any) => e.node) ?? [],
    categories: p.tags ?? [], reviews: [], rating: 0,
    shop: { id: "", name: "", slug: "", email: "", verified: true, coverPicture: "", profilePicture: "",
      socialLinks: { facebook: null, youtube: null, twitter: null, instagram: null },
      user: { id: "", email: "", verified: true, name: { firstName: "", lastName: "" } }
    },
  } as unknown as Product;
}

const FIELDS = `id title handle vendor tags
  priceRange { minVariantPrice { amount currencyCode } }
  images(first:3) { edges { node { url } } }
  variants(first:5) { edges { node { id title availableForSale price { amount } } } }`;

export const getRelatedProducts = cache(async (): Promise<Product[]> => {
  const data = await storefrontQuery(
    `query { products(first: 8, sortKey: BEST_SELLING) { edges { node { ${FIELDS} } } } }`, {}
  );
  return data?.products?.edges?.map(({ node }: any) => mapProduct(node)) ?? [];
});

export const getFrequentlyBought = cache(async (): Promise<Product[]> => {
  const data = await storefrontQuery(
    `query { products(first: 4, sortKey: CREATED_AT, reverse: true) { edges { node { ${FIELDS} } } } }`, {}
  );
  return data?.products?.edges?.map(({ node }: any) => mapProduct(node)) ?? [];
=======
import axios from "utils/axiosInstance";
import Product from "models/Product.model";

export const getFrequentlyBought = cache(async (): Promise<Product[]> => {
  const response = await axios.get("/api/frequently-bought-products");
  return response.data;
});

export const getRelatedProducts = cache(async (): Promise<Product[]> => {
  const response = await axios.get("/api/related-products");
  return response.data;
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
});
