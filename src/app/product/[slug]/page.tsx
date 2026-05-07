// src/app/product/[slug]/page.tsx
//
// Server Component — fetches product from Shopify and renders the product detail page.
// Includes:
//   • generateMetadata() for SEO + Open Graph (Pinterest Rich Pins, Google, Facebook, etc.)
//   • JSON-LD Product structured data with shipping + return policy
//
// All store-specific values come from src/config/store.config.ts (env-driven).

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetails from "pages-sections/product-details/page-view/product-details";
import { storefrontQuery } from "lib/shopify";
import storeConfig from "config/store.config";

type Props = {
  params: Promise<{ slug: string }>;
};

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
      metafield(namespace: "custom", key: "msrp") { value }
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

const productMemo = new Map<string, Promise<any>>();

async function fetchProduct(slug: string) {
  if (productMemo.has(slug)) return productMemo.get(slug);
  const promise = storefrontQuery(PRODUCT_QUERY, { handle: slug }).then(
    (data) => data?.product || null
  );
  productMemo.set(slug, promise);
  setTimeout(() => productMemo.delete(slug), 5000);
  return promise;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const raw = await fetchProduct(slug);

  if (!raw) {
    return {
      title: `Product not found | ${storeConfig.name}`,
      description: "The requested product could not be found.",
    };
  }

  const brand = raw.vendor || "";
  const title = brand
    ? `${raw.title} by ${brand} | ${storeConfig.name}`
    : `${raw.title} | ${storeConfig.name}`;

  const rawDesc = (raw.description || "").replace(/\s+/g, " ").trim();
  const description = rawDesc
    ? rawDesc.slice(0, 155) + (rawDesc.length > 155 ? "…" : "")
    : `Shop ${raw.title} at ${storeConfig.name}.`;

  const imageUrls: string[] =
    raw.images?.edges?.map((e: any) => e.node.url).filter(Boolean) ||
    (raw.featuredImage?.url ? [raw.featuredImage.url] : []);

  const canonicalUrl = `${storeConfig.siteUrl}/product/${slug}`;

  return {
    title,
    description,
    authors: [{ name: storeConfig.name }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: storeConfig.name,
      type: "website",
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
  const canonicalUrl = `${storeConfig.siteUrl}/product/${slug}`;
  const { shipping, returns } = storeConfig;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description || `${title} available at ${storeConfig.name}`,
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
        name: storeConfig.name,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: shipping.destinationCountry,
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          currency: shipping.rateCurrency,
          value: shipping.rateValue,
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: shipping.handlingDaysMin,
            maxValue: shipping.handlingDaysMax,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: shipping.transitDaysMin,
            maxValue: shipping.transitDaysMax,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: returns.applicableCountry,
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: returns.daysToReturn,
        returnMethod: `https://schema.org/${returns.returnMethod}`,
        returnFees: `https://schema.org/${returns.returnFee}`,
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
    images: raw.images?.edges?.map((edge: any) => edge.node.url) || [],
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
    msrp: raw.metafield?.value ? Number(raw.metafield.value) : null,
    rating: 0,
    reviews: [],
  };

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
          comparePrice: Number(node.compareAtPriceRange?.minVariantPrice?.amount || 0),
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