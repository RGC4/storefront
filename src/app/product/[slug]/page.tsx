import { notFound } from "next/navigation";
import ProductDetails from "pages-sections/product-details/page-view/product-details";
import { storefrontQuery } from "lib/shopify";

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

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const data = await storefrontQuery(PRODUCT_QUERY, { handle: slug });
  const raw = data?.product;

  if (!raw) return notFound();

  const firstVariant = raw.variants?.edges?.[0]?.node;

  const product = {
    id: raw.id,
    slug: raw.handle,
    title: raw.title,
    brand: raw.vendor,
    description: raw.description,
    thumbnail: raw.featuredImage?.url || "",
    images: raw.images?.edges?.map((edge: any) => edge.node.url) || [],
    variants: raw.variants?.edges?.map((edge: any) => ({
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

  // Fetch related products by same vendor
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
    <ProductDetails
      product={product as any}
      relatedProducts={relatedProducts}
    />
  );
}
