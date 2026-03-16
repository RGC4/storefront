import { cache } from "react";
import { shopifyFetch } from "@/lib/shopify";

const OTHERS = [
  { label: "On Sale", value: "sale" },
  { label: "In Stock", value: "stock" },
  { label: "Featured", value: "featured" }
];

const COLORS = ["#1C1C1C", "#FF7A7A", "#FFC672", "#84FFB5", "#70F6FF", "#6B7AFF"];

const GET_FILTERS_QUERY = `
  query GetFilters {
    collections(first: 20) {
      edges {
        node { title handle }
      }
    }
    products(first: 250) {
      edges {
        node { vendor }
      }
    }
  }
`;

const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    products(query: $query, first: $first) {
      edges {
        node {
          id
          title
          vendor
          handle
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url altText } }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                price { amount currencyCode }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const getFilters = cache(async (store: string = "s1") => {
  type FiltersResult = {
    collections: { edges: { node: { title: string; handle: string } }[] };
    products: { edges: { node: { vendor: string } }[] };
  };

  const data = await shopifyFetch<FiltersResult>(store, GET_FILTERS_QUERY);

  const categories = data.collections.edges.map((e) => ({ title: e.node.title }));

  const vendorSet = new Set(data.products.edges.map((e) => e.node.vendor));
  const brands = Array.from(vendorSet).map((v) => ({ label: v, value: v.toLowerCase() }));

  return { categories, brands, others: OTHERS, colors: COLORS };
});

interface Params {
  q: string;
  page: string;
  sale: string;
  sort: string;
  prices: string;
  colors: string;
  brands: string;
  rating: string;
  category: string;
  store?: string;
}

export const getProducts = cache(
  async ({ q, category, brands, sale, store = "s1" }: Params) => {
    const queryParts: string[] = [];
    if (q) queryParts.push(q);
    if (category) queryParts.push(`product_type:${category}`);
    if (brands) queryParts.push(`vendor:${brands}`);
    if (sale) queryParts.push(`tag:sale`);

    const queryString = queryParts.length > 0 ? queryParts.join(" AND ") : "*";

    type SearchResult = {
      products: {
        edges: { node: any }[];
        pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
      };
    };

    const data = await shopifyFetch<SearchResult>(store, SEARCH_PRODUCTS_QUERY, {
      query: queryString,
      first: 10
    });

    const products = data.products.edges.map((e) => e.node);

    return {
      products,
      pageCount: 1,
      totalProducts: products.length,
      firstIndex: 0,
      lastIndex: products.length - 1
    };
  }
);
