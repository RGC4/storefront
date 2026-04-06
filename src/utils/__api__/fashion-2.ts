import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import { getStoreConfig } from "@/lib/storeResolver";
import Product, { ProductVariant } from "models/Product.model";

interface ShopifyImageEdge { node: { src: string } }
interface ShopifyVariantEdge { node: { id: string; title: string; price: { amount: string }; availableForSale: boolean } }
interface ShopifyProduct {
  id: string; title: string; handle: string; vendor: string; tags: string[];
  description?: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: ShopifyImageEdge[] };
  variants: { edges: ShopifyVariantEdge[] };
}
interface ShopifyEdge<T> { node: T }
interface ShopifyCollection {
  id: string; title: string; handle: string; description: string;
  image?: { src: string; altText?: string };
  products: { edges: { node: { tags: string[]; featuredImage?: { url: string } } }[] };
}

function mapProduct(p: ShopifyProduct): Product {
  const cfg          = getStoreConfig();
  const price        = parseFloat(p.priceRange?.minVariantPrice?.amount || "0");
  const comparePrice = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount || "0");
  const images       = p.images?.edges?.map((e) => e.node.src) ?? [];
  return {
    id: p.id, slug: p.handle, title: p.title, brand: p.vendor || undefined,
    price,
    comparePrice: comparePrice > 0 ? comparePrice : undefined,
    discount: comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0,
    colors: [], thumbnail: images[0] ?? "", images,
    variants: p.variants?.edges?.map((e): ProductVariant => e.node) ?? [],
    categories: p.tags ?? [], reviews: [], rating: 0,
    shop: {
      id: "", name: cfg.storeName, slug: "", email: "",
      verified: true, coverPicture: "", profilePicture: "",
      phone: "", address: "",
      socialLinks: { facebook: null, youtube: null, twitter: null, instagram: null },
      user: {
        id: "", email: "", phone: "", avatar: "", password: "", dateOfBirth: "",
        verified: true, name: { firstName: cfg.storeName, lastName: "" },
      },
    },
  };
}

async function fetchProducts(limit = 24): Promise<Product[]> {
  const { storeId } = getStoreConfig();
  const data = await storefrontQuery(
    `query P($n:Int!, $q:String){products(first:$n, sortKey:BEST_SELLING, query:$q){edges{node{id title handle vendor tags priceRange{minVariantPrice{amount currencyCode}}compareAtPriceRange{minVariantPrice{amount currencyCode}}images(first:3){edges{node{src:url}}}variants(first:5){edges{node{id title price{amount}availableForSale}}}}}}}`,
    { n: limit, q: `tag:${storeId}` }
  );
  return (data?.products?.edges ?? []).map(({ node }: ShopifyEdge<ShopifyProduct>) => mapProduct(node));
}

export const getProducts         = cache(() => fetchProducts(24));
export const getFeatureProducts  = cache(async () => (await fetchProducts(8)).filter(p => p.categories?.includes("feature")));
export const getSaleProducts     = cache(async () => (await fetchProducts(8)).filter(p => p.categories?.includes("sale")));
export const getPopularProducts  = cache(async () => (await fetchProducts(8)).filter(p => p.categories?.includes("popular")));
export const getBestWeekProducts = cache(async () => (await fetchProducts(8)).filter(p => p.categories?.includes("best-week")));

export const getLatestProducts = cache(async (): Promise<Product[]> => {
  const { storeId } = getStoreConfig();
  const data = await storefrontQuery(
    `query($q:String){products(first:8, sortKey:CREATED_AT, reverse:true, query:$q){edges{node{id title handle vendor tags priceRange{minVariantPrice{amount currencyCode}}images(first:3){edges{node{src:url}}}variants(first:5){edges{node{id title price{amount}availableForSale}}}}}}}`,
    { q: `tag:${storeId}` }
  );
  return (data?.products?.edges ?? []).map(({ node }: ShopifyEdge<ShopifyProduct>) => mapProduct(node));
});

export const getCategories = cache(async () => {
  const { storeId } = getStoreConfig();
  const data = await storefrontQuery(
    `query { collections(first: 50, sortKey: TITLE) { edges { node {
      id title handle description
      image { src: url altText }
      products(first: 1) { edges { node { tags featuredImage { url } } } }
    } } } }`,
    {}
  );
  const CATEGORY_ORDER = ["clutch-bags", "crossbody-bags", "shoulder-bags", "handbags", "tote-bags"];
  
  const categories = data?.collections?.edges
    ?.filter(({ node: c }: ShopifyEdge<ShopifyCollection>) =>
      c.products?.edges?.[0]?.node?.tags?.includes(storeId)
    )
    ?.map(({ node: c }: ShopifyEdge<ShopifyCollection>) => ({
      id: c.id, name: c.title, slug: c.handle, description: c.description,
      image: c.image?.src ?? c.products?.edges?.[0]?.node?.featuredImage?.url ?? "",
    })) ?? [];
  
  // Sort by custom order, unknowns go to end
  categories.sort((a: any, b: any) => {
    const ai = CATEGORY_ORDER.indexOf(a.slug);
    const bi = CATEGORY_ORDER.indexOf(b.slug);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return categories;
});

export const getMainCarouselData = cache(async () => []);
export interface ServiceCard { id: string; icon: string; title: string; description: string }
export const getBlogs    = cache(async () => []);
export const getBrands   = cache(async () => []);
export const getServices = cache(async (): Promise<ServiceCard[]> => [
  { id: "1", icon: "Truck",    title: "Free Delivery",      description: "On all orders" },
  { id: "2", icon: "Payment",  title: "Secure Payment",     description: "Safe & protected" },
  { id: "3", icon: "Verified", title: "Authentic Products", description: "100% guaranteed" },
  { id: "4", icon: "Support",  title: "Concierge Care",     description: "White-glove service, every time" },
]);

export default {
  getBlogs, getBrands, getProducts, getServices, getCategories,
  getSaleProducts, getLatestProducts, getPopularProducts,
  getFeatureProducts, getBestWeekProducts, getMainCarouselData,
};
