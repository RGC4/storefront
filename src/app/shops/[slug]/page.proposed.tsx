// PROPOSED REPLACEMENT — review and merge by hand.
// The current app/shops/[slug]/page.tsx still ships Bazaar template metadata
// ("Shop Details - Bazaar Next.js E-commerce Template"). This is the worst
// SEO bug in the repo — every shop page tells Google it's a template demo.
//
// This file replaces the static metadata with generateMetadata() driven by
// the actual shop record.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopDetailsPageView } from "pages-sections/shops/page-view";
import api from "utils/__api__/shop";
import { getFilters } from "utils/__api__/product-search";
import { SlugParams } from "models/Common";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Imperial Accessories";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.imperialaccessories.com";

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const shop = await api.getProductsBySlug(slug).catch(() => null);
  const name = shop?.name || slug.replace(/-/g, " ");
  const title = `${name} | ${STORE_NAME}`;
  const description = `Shop ${name} at ${STORE_NAME} — authenticated designer handbags, new with tags, sourced from Italy.`;
  return {
    title,
    description,
    openGraph: { title, description, url: `${BASE_URL}/shops/${slug}`, siteName: STORE_NAME, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${BASE_URL}/shops/${slug}` },
  };
}

export default async function ShopDetails({ params }: SlugParams) {
  const { slug } = await params;
  const shop = await api.getProductsBySlug(slug);
  const filters = await getFilters();
  if (!shop) notFound();
  return <ShopDetailsPageView shop={shop} filters={filters} />;
}
