import { cache } from "react";
import { storefrontQuery } from "lib/shopify";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

// ── Mapper ─────────────────────────────────────────────────────────────────────

function mapProduct(p: any) {
  const price = parseFloat(p.priceRange?.minVariantPrice?.amount ?? 0);
  const comparePrice = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount ?? 0);
  const images = p.images?.edges?.map((e: any) => e.node.url) ?? [];

  return {
    id: p.id,
    slug: p.handle,
    title: p.title,
    brand: p.vendor ?? null,
    price,
    comparePrice,
    discount:
      comparePrice > price
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0,
    colors: [],
    thumbnail: images[0] ?? "",
    images,
    variants: p.variants?.edges?.map((e: any) => e.node) ?? [],
    categories: p.tags ?? [],
    reviews: [],
    rating: 0,
    description: p.description ?? "",
    descriptionHtml: p.descriptionHtml ?? "",
    shop: {
      id: "",
      name: process.env.NEXT_PUBLIC_STORE_NAME ?? "Store",
      slug: "",
      email: "",
      phone: "",
      address: "",
      verified: true,
      coverPicture: "",
      profilePicture: "",
      socialLinks: { facebook: null, youtube: null, twitter: null, instagram: null },
      user: {
        id: "",
        email: "",
        phone: "",
        avatar: "",
        password: "",
        dateOfBirth: "",
        verified: true,
        name: {
          firstName: process.env.NEXT_PUBLIC_STORE_NAME ?? "Store",
          lastName: "",
        },
      },
    },
  };
}

// ── Queries ────────────────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  id title handle vendor tags description descriptionHtml
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  images(first: 10) { edges { node { url altText } } }
  variants(first: 20) {
    edges {
      node {
        id title availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
`;

// All products (used for listing pages) - filtered by store tag
const getProducts = cache(async (limit = 24) => {
  const data = await storefrontQuery(
    `query Products($n: Int!, $q: String) {
      products(first: $n, sortKey: BEST_SELLING, query: $q) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { n: limit, q: `tag:${STORE_ID}` }
  );
  return data.products.edges.map(({ node }: any) => mapProduct(node));
});

// Single product by handle/slug (no store filter - direct access by handle is fine)
const getProduct = cache(async (slug: string) => {
  const data = await storefrontQuery(
    `query Product($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }`,
    { handle: slug }
  );
  return data.product ? mapProduct(data.product) : null;
});

// All handles for generateStaticParams - filtered by store tag
const getSlugs = cache(async () => {
  const data = await storefrontQuery(
    `query($q: String) {
      products(first: 250, query: $q) {
        edges { node { handle } }
      }
    }`,
    { q: `tag:${STORE_ID}` }
  );
  return data.products.edges.map(({ node }: any) => ({ slug: node.handle }));
});

// Search products by title - filtered by store tag
const searchProducts = cache(async (name?: string, _category?: string) => {
  const parts: string[] = [`tag:${STORE_ID}`];
  if (name) parts.push(`title:*${name}*`);
  const q = parts.join(" AND ");
  const data = await storefrontQuery(
    `query Search($q: String!) {
      products(first: 20, query: $q) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { q }
  );
  return data.products.edges.map(({ node }: any) => mapProduct(node));
});

// Product reviews — Shopify Storefront API doesn't expose reviews natively
const getProductReviews = cache(async () => []);

export default { getSlugs, getProduct, getProducts, searchProducts, getProductReviews };
