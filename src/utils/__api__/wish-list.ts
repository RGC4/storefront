import { shopifyFetch } from "@/lib/shopify";

const GET_WISHLIST_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
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
    }
  }
`;

export const getWishListProducts = async (page = 1, store: string = "s1") => {
  const PAGE_SIZE = 6;

  type WishlistResult = {
    products: { edges: { node: any }[] };
  };

  const data = await shopifyFetch<WishlistResult>(store, GET_WISHLIST_PRODUCTS_QUERY, {
    first: page * PAGE_SIZE
  });

  const allProducts = data.products.edges.map((e) => e.node);
  const start = (page - 1) * PAGE_SIZE;
  const currentProducts = allProducts.slice(start, start + PAGE_SIZE);

  return {
    products: currentProducts,
    totalPages: Math.ceil(allProducts.length / PAGE_SIZE)
  };
};
