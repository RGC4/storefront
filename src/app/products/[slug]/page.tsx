// src/app/products/[slug]/page.tsx
// FIXES: metadata says "Bazaar Next.js Template", no JSON-LD schema

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsPageView } from "pages-sections/product-details/page-view";
import api from "utils/__api__/products";
import { getFrequentlyBought, getRelatedProducts } from "utils/__api__/related-products";
import { SlugParams } from "models/Common";
import ProductJsonLd from "./product-jsonld";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com";

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await api.getProduct(slug);
  if (!product) notFound();

  const title = product.brand
    ? `${product.title} by ${product.brand} | ${STORE_NAME}`
    : `${product.title} | ${STORE_NAME}`;

  const description = product.description
    ? product.description.slice(0, 155).replace(/\s+/g, " ").trim() + "…"
    : `Shop ${product.title} at ${STORE_NAME}. Authentic luxury designer fashion at competitive prices.`;

  return {
    title,
    description,
    authors: [{ name: STORE_NAME }],
    keywords: [
      product.title,
      product.brand,
      "designer bags",
      "luxury fashion",
      "authentic designer",
      STORE_NAME,
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/products/${slug}`,
      siteName: STORE_NAME,
      images: product.images?.length
        ? [{ url: product.images[0], width: 1200, height: 1200, alt: product.title }]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images?.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductDetails({ params }: SlugParams) {
  const { slug } = await params;
  const [product, relatedProducts, frequentlyBought] = await Promise.all([
    api.getProduct(slug),
    getRelatedProducts(),
    getFrequentlyBought(),
  ]);

  if (!product) notFound();

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailsPageView
        product={product}
        relatedProducts={relatedProducts}
        frequentlyBought={frequentlyBought}
      />
    </>
  );
}
