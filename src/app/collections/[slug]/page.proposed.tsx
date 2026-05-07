// PROPOSED REPLACEMENT — review and merge by hand.
// Adds generateMetadata() driven by the Shopify collection record so each
// collection PLP gets a unique title and meta description (the current
// app/collections/[slug]/page.tsx exports no metadata).
//
// Merge instructions:
//   1. Open this file alongside the existing page.tsx.
//   2. Diff the two and copy the generateMetadata export into page.tsx.
//   3. Delete this .proposed.tsx file.

import type { Metadata } from "next";
import { storefrontQuery } from "lib/shopify";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Imperial Accessories";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.imperialaccessories.com";

const COLLECTION_META_QUERY = `
  query CollectionMeta($handle: String!) {
    collection(handle: $handle) {
      title
      description
      seo { title description }
      image { url }
    }
  }
`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data: any = await storefrontQuery(COLLECTION_META_QUERY, { handle: slug }).catch(() => null);
  const c = data?.collection;
  if (!c) return { title: `Shop ${STORE_NAME}`, description: `${STORE_NAME}: authenticated luxury designer handbags, new with tags.` };

  const title = c.seo?.title || `${c.title} — Authenticated Designer Bags | ${STORE_NAME}`;
  const description =
    c.seo?.description ||
    (c.description?.slice(0, 155).trim() + (c.description?.length > 155 ? "…" : "")) ||
    `Shop ${c.title} at ${STORE_NAME} — authenticated, new with tags, sourced from Italy.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/collections/${slug}`,
      siteName: STORE_NAME,
      images: c.image?.url ? [{ url: c.image.url, alt: c.title }] : undefined,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: c.image?.url ? [c.image.url] : undefined },
    alternates: { canonical: `${BASE_URL}/collections/${slug}` },
  };
}
