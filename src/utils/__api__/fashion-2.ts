import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import storeConfig from "config/store.config";
import fs from "fs";
import path from "path";

function mapProduct(p: any) {
  const price = parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
  const comparePrice = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount || 0);
  const images = p.images?.edges?.map((e: any) => e.node.src) || [];
  return {
    id: p.id, slug: p.handle, title: p.title, brand: p.vendor || null,
    price, comparePrice,
    discount: comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0,
    colors: [], thumbnail: images[0] || "", images,
    variants: p.variants?.edges?.map((e: any) => e.node) || [],
    categories: p.tags || [], reviews: [], rating: 0,
    shop: {
      id: "", name: storeConfig.name, slug: "", email: storeConfig.email,
      verified: true, coverPicture: "", profilePicture: "",
      socialLinks: { facebook: null, youtube: null, twitter: null, instagram: null },
      user: { id: "", email: storeConfig.email, verified: true, name: { firstName: storeConfig.name, lastName: "" } }
    },
  };
}

async function fetchProducts(limit = 24) {
  const data = await storefrontQuery(
    `query P($n:Int!){products(first:$n,sortKey:BEST_SELLING){edges{node{id title handle vendor tags priceRange{minVariantPrice{amount currencyCode}}compareAtPriceRange{minVariantPrice{amount currencyCode}}images(first:3){edges{node{src:url}}}variants(first:5){edges{node{id title price{amount}availableForSale}}}}}}}`,
    { n: limit }
  );
  return data?.products?.edges?.map(({ node }: any) => mapProduct(node)) ?? [];
}

const getProducts = cache(async () => fetchProducts(24));
const getFeatureProducts = cache(async () => (await fetchProducts(8)).filter((p: any) => p.categories?.includes("feature")));
const getSaleProducts = cache(async () => (await fetchProducts(8)).filter((p: any) => p.categories?.includes("sale")));
const getPopularProducts = cache(async () => (await fetchProducts(8)).filter((p: any) => p.categories?.includes("popular")));
const getBestWeekProducts = cache(async () => (await fetchProducts(8)).filter((p: any) => p.categories?.includes("best-week")));

const getLatestProducts = cache(async () => {
  const data = await storefrontQuery(
    `query{products(first:8,sortKey:CREATED_AT,reverse:true){edges{node{id title handle vendor tags priceRange{minVariantPrice{amount currencyCode}}images(first:3){edges{node{src:url}}}variants(first:5){edges{node{id title price{amount}availableForSale}}}}}}}`,
    {}
  );
  return data?.products?.edges?.map(({ node }: any) => mapProduct(node)) ?? [];
});

const getCategories = cache(async () => {
  const data = await storefrontQuery(
    `query { collections(first: 50, sortKey: TITLE) { edges { node { 
      id title handle description 
      image { src: url altText }
      products(first: 1) { edges { node { featuredImage { url } } } }
    } } } }`,
    {}
  );
  return data?.collections?.edges?.map(({ node: c }: any) => ({
    id: c.id,
    name: c.title,
    icon: null,
    image: c.image?.src || c.products?.edges?.[0]?.node?.featuredImage?.url || "",
    slug: c.handle,
    parent: [],
    description: c.description || null,
  })) ?? [];
});

const getMainCarouselData = cache(async () => {
  const storeId = storeConfig.storeId;
  const picDir = path.join(process.cwd(), "public", "pictures", storeId);

  try {
    if (fs.existsSync(picDir)) {
      const files = fs.readdirSync(picDir);

      const mp4 = files.find(f => f.endsWith(".mp4"));
      if (mp4) {
        return [{
          title: storeConfig.heroTitle,
          imgUrl: `/pictures/${storeId}/${mp4}`,
          isVideo: true,
          description: storeConfig.heroSubtitle,
          buttonText: storeConfig.heroButtonText,
          buttonLink: storeConfig.heroButtonLink,
        }];
      }

      const heroImages = files
        .filter(f => /^hero-\d+\.(png|jpg|jpeg|webp)$/i.test(f))
        .sort();

      if (heroImages.length > 0) {
        return heroImages.map((img, i) => ({
          title: i === 0 ? storeConfig.heroTitle : "",
          imgUrl: `/pictures/${storeId}/${img}`,
          description: i === 0 ? storeConfig.heroSubtitle : "",
          buttonText: i === 0 ? storeConfig.heroButtonText : "",
          buttonLink: storeConfig.heroButtonLink,
        }));
      }
    }
  } catch {}

  return [{
    title: storeConfig.heroTitle,
    imgUrl: "/assets/images/banners/banner-1.png",
    description: storeConfig.heroSubtitle,
    buttonText: storeConfig.heroButtonText,
    buttonLink: storeConfig.heroButtonLink,
  }];
});

const getBlogs = cache(async () => []);
const getBrands = cache(async () => []);
const getServices = cache(async () => [
  { id: "1", icon: "Truck", title: "Free Delivery", description: "On all orders" },
  { id: "2", icon: "Payment", title: "Secure Payment", description: "Safe & protected" },
  { id: "3", icon: "Verified", title: "Quality Products", description: "100% guaranteed" },
  { id: "4", icon: "Support", title: "24/7 Support", description: "We care for you" },
] as any);

export default {
  getBlogs, getBrands, getProducts, getServices, getCategories,
  getSaleProducts, getLatestProducts, getPopularProducts,
  getFeatureProducts, getBestWeekProducts, getMainCarouselData,
};
