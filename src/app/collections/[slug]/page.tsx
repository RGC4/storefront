// src/app/collections/[slug]/page.tsx
// FIXES: No metadata exported, Google sees generic titles for all collections

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storefrontQuery } from "lib/shopify";
import CollectionView from "./CollectionView";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com";

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

// Lightweight query just for metadata (no product list needed)
const COLLECTION_META_QUERY = `
  query CollectionMeta($handle: String!) {
    collection(handle: $handle) {
      title
      description
      image { url }
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

// ── NEW: Dynamic metadata for each collection ──────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const data: any = await storefrontQuery(COLLECTION_META_QUERY, {
    handle: slug,
  }).catch(() => null);

  const collection = data?.collection;
  if (!collection) {
    return { title: `Collection | ${STORE_NAME}` };
  }

  const title = `${collection.title} | ${STORE_NAME}`;
  const description = collection.description
    ? collection.description.slice(0, 155).replace(/\s+/g, " ").trim()
    : `Shop our ${collection.title} collection at ${STORE_NAME}. Authentic luxury designer fashion.`;

  return {
    title,
    description,
    authors: [{ name: STORE_NAME }],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/collections/${slug}`,
      siteName: STORE_NAME,
      images: collection.image?.url
        ? [{ url: collection.image.url, width: 1200, height: 630, alt: collection.title }]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ── Page component (unchanged logic) ────────────────────────────────────────
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { title, description, products } = await fetchAllProducts(slug);
  if (!title) return notFound();

  // Collection JSON-LD for rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description || `${title} collection at ${STORE_NAME}`,
    url: `${BASE_URL}/collections/${slug}`,
    numberOfItems: products.length,
    provider: {
      "@type": "Organization",
      name: STORE_NAME,
      url: BASE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionView title={title} description={description} products={products} />
    </>
  );
}
