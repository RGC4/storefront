// src/utils/__api__/layout.ts
import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import { getStoreConfig } from "lib/storeData";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const getLayoutData = cache(async () => {
  // Load store config from Vercel Blob
  const storeConfig = await getStoreConfig(STORE_ID);

  // Fallback values if blob is unavailable
  const logo        = storeConfig?.logo?.header        || "/assets/stores/s1/logo/logo-header.png";
  const footerLogo  = storeConfig?.logo?.footer        || "/assets/stores/s1/logo/logo-footer.png";
  const description = storeConfig?.footerDescription   || "";
  const email       = storeConfig?.email               || "";
  const phone       = storeConfig?.phone               || "";
  const address     = storeConfig?.address             || "";
  const social      = storeConfig?.social              || { google: "", twitter: "", youtube: "", facebook: "", instagram: "", tiktok: "" };

  const data = await storefrontQuery(
    `query {
      collections(first: 50, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            image {
              url
              altText
            }
            products(first: 6) {
              edges {
                node {
                  id
                  title
                  handle
                  priceRange {
                    minVariantPrice { amount currencyCode }
                  }
                  images(first: 1) {
                    edges { node { url altText } }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    {}
  );

  const collections = data.collections.edges.map(({ node: c }: any) => ({
    title: c.title,
    value: c.handle,
  }));

  const categoryMenus = data.collections.edges.map(({ node: c }: any) => ({
    title: c.title,
    href: `/collections/${c.handle}`,
    icon: "ShoppingBag",
    value: c.handle,
    image: c.image?.url || null,
    productCount: c.products?.totalCount ?? 0,
    children: c.products.edges.map(({ node: p }: any) => ({
      title: p.title,
      href: `/product/${p.handle}`,
      image: p.images.edges[0]?.node.url || null,
      price: p.priceRange.minVariantPrice.amount,
      currency: p.priceRange.minVariantPrice.currencyCode,
    })),
  }));

  return {
    header: {
      logo,
      categories: collections,
      categoryMenus,
      navigation: [],
    },
    footer: {
      logo: footerLogo,
      description,
      appStoreUrl: "",
      playStoreUrl: "",
      about: [
        { title: "About Us",           url: "#" },
        { title: "Terms & Conditions", url: "#" },
        { title: "Privacy Policy",     url: "#" },
      ],
      customers: [
        { title: "Contact Us",              url: "/contact" },
        { title: "Track Your Order",        url: "/order-lookup" },
        { title: "Returns & Exchanges",     url: "/returns" },
        { title: "Corporate & Bulk Orders", url: `mailto:${email}` },
      ],
      socials: {
        google:    social.google    || "",
        twitter:   social.twitter   || "",
        youtube:   social.youtube   || "",
        facebook:  social.facebook  || "",
        instagram: social.instagram || "",
      },
      contact: {
        phone,
        email,
        address,
      },
    },
    topbar: {
      title: "",
      label: "",
      socials: {},
      languageOptions: {},
    },
    mobileNavigation: {
      logo,
      version1: [
        { title: "Home",    icon: "Home",        href: "/",           badge: false },
        { title: "Shop",    icon: "ShoppingBag", href: "/collections", badge: false },
        { title: "Cart",    icon: "Cart",        href: "/cart",        badge: true  },
        { title: "Account", icon: "User",        href: "/profile",     badge: false },
      ],
      version2: [],
    },
  };
});

export default { getLayoutData };
