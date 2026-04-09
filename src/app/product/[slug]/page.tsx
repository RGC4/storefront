// src/app/product/[slug]/page.tsx
//
// Server Component — fetches product from Shopify and renders the product detail
// page. Now includes:
//   • generateMetadata() for SEO + Open Graph tags (Pinterest Rich Pins, Google, etc.)
//   • JSON-LD Product structured data (Google rich snippets, Pinterest Rich Pins)
//
// This matches the pattern already used in src/app/products/[slug]/page.tsx.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetails from "pages-sections/product-details/page-view/product-details";
import { storefrontQuery } from "lib/shopify";

type Props = {
  params: Promise<{ slug: string }>;
};

// ── Env + config ────────────────────────────────────────────────────────────
const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com").replace(/\/$/, "");

// ── GraphQL queries ─────────────────────────────────────────────────────────
const PRODUCT_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      vendor
      availableForSale
      tags
      featuredImage { url }
      images(first: 20) {
        edges { node { url } }
      }
      variants(first: 50) {
        edges {
          node {
            id
            availableForSale
            selectedOptions { name value }
            price { amount }
            compareAtPrice { amount }
          }
        }
      }
    }
  }
`;

const RELATED_QUERY = `
  query RelatedByVendor($query: String!) {
    products(first: 12, query: $query, sortKey: BEST_SELLING) {
      edges {
        node {
          id handle title vendor
          featuredImage { url }
          priceRange { minVariantPrice { amount } }
          compareAtPriceRange { minVariantPrice { amount } }
        }
      }
    }
  }
`;

// ── Shared fetcher — used by both generateMetadata() and the page component ─
// Small in-request memoization prevents the same handle from being fetched twice
// (once for metadata, once for the page body). Next.js dedupes fetches per request
// automatically when cache is not "no-store", but storefrontQuery currently sets
// cache: "no-store", so we add our own per-request memo.
const productMemo = new Map<string, Promise<any>>();

async function fetchProduct(slug: string) {
  if (productMemo.has(slug)) return productMemo.get(slug);
  const promise = storefrontQuery(PRODUCT_QUERY, { handle: slug }).then(
    (data) => data?.product || null
  );
  productMemo.set(slug, promise);
  // Clean up memo after a short delay — each request spins up its own module
  // instance in most deployment targets, but we still clear to be safe.
  setTimeout(() => productMemo.delete(slug), 5000);
  return promise;
}

// ── Metadata generator ─────────────────────────────────────────────────────
// This is what Pinterest, Google, Facebook, LinkedIn, and every other crawler
// reads when they hit this URL. Without this function, there are no meta tags,
// no Open Graph, and no pin-worthy preview.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const raw = await fetchProduct(slug);

  if (!raw) {
    return {
      title: `Product not found | ${STORE_NAME}`,
      description: "The requested product could not be found.",
    };
  }

  const brand = raw.vendor || "";
  const title = brand
    ? `${raw.title} by ${brand} | ${STORE_NAME}`
    : `${raw.title} | ${STORE_NAME}`;

  // Trim description to ~155 chars for meta description best practice
  const rawDesc = (raw.description || "").replace(/\s+/g, " ").trim();
  const description = rawDesc
    ? rawDesc.slice(0, 155) + (rawDesc.length > 155 ? "…" : "")
    : `Shop ${raw.title} at ${STORE_NAME}. Authentic luxury designer fashion at competitive prices.`;

  const imageUrls: string[] =
    raw.images?.edges?.map((e: any) => e.node.url).filter(Boolean) ||
    (raw.featuredImage?.url ? [raw.featuredImage.url] : []);

  const canonicalUrl = `${BASE_URL}/product/${slug}`;

  return {
    title,
    description,
    authors: [{ name: STORE_NAME }],
    keywords: [
      raw.title,
      brand,
      "designer bag",
      "luxury handbag",
      "authentic designer",
      "new with tags",
      STORE_NAME,
      ...((raw.tags || []) as string[]),
    ].filter(Boolean) as string[],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: STORE_NAME,
      type: "website", // Next.js Metadata API doesn't support "product" type directly;
                      // product-specific meta is emitted via the <head> tags in the
                      // page body below + the JSON-LD script.
      images: imageUrls.slice(0, 4).map((url) => ({
        url,
        width: 1200,
        height: 1200,
        alt: raw.title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls.slice(0, 1),
    },
    other: {
      // Pinterest + Facebook product-specific Open Graph tags.
      // These get rendered into <head> as <meta property="..." content="..."> tags
      // and are exactly what Pinterest reads to build Product Rich Pins.
      "og:type": "product",
      "product:brand": brand,
      "product:availability": raw.availableForSale ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:price:amount":
        raw.variants?.edges?.[0]?.node?.price?.amount?.toString() || "0",
      "product:price:currency": "USD",
    },
  };
}

// ── JSON-LD structured data ─────────────────────────────────────────────────
// Rendered as a <script> tag in the page body. Google, Pinterest, and Bing
// all use this for rich product cards.
function ProductJsonLd({
  title,
  description,
  brand,
  price,
  availability,
  images,
  slug,
}: {
  title: string;
  description: string;
  brand: string | null;
  price: number;
  availability: boolean;
  images: string[];
  slug: string;
}) {
  const canonicalUrl = `${BASE_URL}/product/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description || `${title} available at ${STORE_NAME}`,
    image: images,
    url: canonicalUrl,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "USD",
      price: price.toFixed(2),
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split("T")[0],
      availability: availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: STORE_NAME,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Page component ─────────────────────────────────────────────────────────
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const raw = await fetchProduct(slug);
  if (!raw) return notFound();

  const firstVariant = raw.variants?.edges?.[0]?.node;

  const product = {
    id: raw.id,
    slug: raw.handle,
    title: raw.title,
    brand: raw.vendor,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    thumbnail: raw.featuredImage?.url || "",
    images:
      raw.images?.edges?.map((edge: any) => edge.node.url) || [],
    variants:
      raw.variants?.edges?.map((edge: any) => ({
        id: edge.node.id,
        availableForSale: edge.node.availableForSale,
        selectedOptions: edge.node.selectedOptions,
        price: Number(edge.node.price?.amount || 0),
        comparePrice: Number(edge.node.compareAtPrice?.amount || 0),
      })) || [],
    price: Number(firstVariant?.price?.amount || 0),
    comparePrice: Number(firstVariant?.compareAtPrice?.amount || 0),
    categories: raw.tags || [],
    rating: 0,
    reviews: [],
  };

  // Fetch related products by same vendor (unchanged from original)
  let relatedProducts: any[] = [];
  if (raw.vendor) {
    try {
      const relatedData = await storefrontQuery(RELATED_QUERY, {
        query: `vendor:"${raw.vendor}"`,
      });
      relatedProducts = (relatedData?.products?.edges ?? [])
        .map(({ node }: any) => ({
          id: node.id,
          slug: node.handle,
          title: node.title,
          brand: node.vendor,
          thumbnail: node.featuredImage?.url || "",
          price: Number(node.priceRange?.minVariantPrice?.amount || 0),
          comparePrice: Number(
            node.compareAtPriceRange?.minVariantPrice?.amount || 0
          ),
          images: node.featuredImage ? [node.featuredImage.url] : [],
          categories: [],
          rating: 0,
          reviews: [],
          discount: 0,
        }))
        .filter((p: any) => p.slug !== slug)
        .slice(0, 8);
    } catch (err) {
      console.error("Related products fetch failed:", err);
    }
  }

  return (
    <>
      <ProductJsonLd
        title={product.title}
        description={product.description || ""}
        brand={product.brand || null}
        price={product.price}
        availability={raw.availableForSale}
        images={product.images}
        slug={slug}
      />
      <ProductDetails
        product={product as any}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
