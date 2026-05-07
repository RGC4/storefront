// src/app/products/[slug]/page.tsx
//
// Plural product route. All store-specific values come from src/config/store.config.ts.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsPageView } from "pages-sections/product-details/page-view";
import api from "utils/__api__/products";
import { getFrequentlyBought, getRelatedProducts } from "utils/__api__/related-products";
import { SlugParams } from "models/Common";
import storeConfig from "config/store.config";
import ProductJsonLd from "./product-jsonld";

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await api.getProduct(slug);
  if (!product) notFound();

  const title = product.brand
    ? `${product.title} by ${product.brand} | ${storeConfig.name}`
    : `${product.title} | ${storeConfig.name}`;

  const description = product.description
    ? product.description.slice(0, 155).replace(/\s+/g, " ").trim() + "…"
    : `Shop ${product.title} at ${storeConfig.name}.`;

  const productUrl = `${storeConfig.siteUrl}/products/${slug}`;

  return {
    title,
    description,
    authors: [{ name: storeConfig.name }],
    alternates: { canonical: productUrl },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: storeConfig.name,
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