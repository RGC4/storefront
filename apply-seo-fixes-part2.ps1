# =============================================================
# apply-seo-fixes-part2.ps1
# Installs the 3 files that failed because [slug] folders
# don't survive Windows zip extraction
#
# Run from project root:
#   PowerShell -ExecutionPolicy Bypass -File "apply-seo-fixes-part2.ps1"
# =============================================================

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Info  { param($msg) Write-Host "[INFO]  $msg" -ForegroundColor Cyan }
function Pass  { param($msg) Write-Host "[PASS]  $msg" -ForegroundColor Green }
function Warn  { param($msg) Write-Host "[WARN]  $msg" -ForegroundColor Yellow }

Info "Installing 3 remaining SEO fix files..."
Info ""

# -----------------------------------------------------------------
# 1. src/app/products/[slug]/page.tsx
# -----------------------------------------------------------------
$path1 = Join-Path $root "src\app\products\[slug]\page.tsx"
if (Test-Path $path1) { Copy-Item $path1 "$path1.bak" -Force; Warn "Backed up products/[slug]/page.tsx" }

Set-Content -Path $path1 -Encoding UTF8 -Value @'
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
    ? product.description.slice(0, 155).replace(/\s+/g, " ").trim() + "..."
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
'@

Pass "Installed: src/app/products/[slug]/page.tsx"

# -----------------------------------------------------------------
# 2. src/app/products/[slug]/product-jsonld.tsx (NEW FILE)
# -----------------------------------------------------------------
$path2 = Join-Path $root "src\app\products\[slug]\product-jsonld.tsx"

Set-Content -Path $path2 -Encoding UTF8 -Value @'
const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com";

interface ProductJsonLdProps {
  product: {
    title: string;
    slug: string;
    description?: string;
    brand?: string | null;
    price: number;
    comparePrice?: number;
    images: string[];
    variants?: { availableForSale?: boolean }[];
  };
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const isAvailable = product.variants?.some((v) => v.availableForSale) ?? true;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `${product.title} available at ${STORE_NAME}`,
    image: product.images,
    url: `${BASE_URL}/products/${product.slug}`,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split("T")[0],
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
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
'@

Pass "Installed: src/app/products/[slug]/product-jsonld.tsx"

# -----------------------------------------------------------------
# 3. src/app/collections/[slug]/page.tsx
# -----------------------------------------------------------------
$path3 = Join-Path $root "src\app\collections\[slug]\page.tsx"
if (Test-Path $path3) { Copy-Item $path3 "$path3.bak" -Force; Warn "Backed up collections/[slug]/page.tsx" }

Set-Content -Path $path3 -Encoding UTF8 -Value @'
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

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { title, description, products } = await fetchAllProducts(slug);
  if (!title) return notFound();

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
'@

Pass "Installed: src/app/collections/[slug]/page.tsx"

Write-Host ""
Info "=========================================="
Pass "All 3 remaining files installed!"
Info "=========================================="
Info ""
Info "All 8 SEO fixes are now in place. Push to deploy."
