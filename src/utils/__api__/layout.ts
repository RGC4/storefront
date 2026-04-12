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

  const CATEGORY_ORDER = ["clutch-bags", "crossbody-bags", "shoulder-bags", "handbags", "tote-bags"];

  const data = await storefrontQuery(
    `query {
      collections(first: 50, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            image { url altText }
            metafield(namespace: "custom", key: "store_ids") { value }
            productsCount { count }
            products(first: 6) {
              edges {
                node {
                  id title handle
                  priceRange { minVariantPrice { amount currencyCode } }
                  images(first: 1) { edges { node { url altText } } }
                }
              }
            }
          }
        }
      }
    }`,
    {}
  );

  // Filter by store_ids metafield and sort in canonical order
  const storeEdges = data.collections.edges
    .filter(({ node: c }: any) => {
      const ids = (c.metafield?.value || "").split(",").map((s: string) => s.trim());
      return ids.includes(STORE_ID);
    })
    .sort(({ node: a }: any, { node: b }: any) => {
      const ai = CATEGORY_ORDER.indexOf(a.handle);
      const bi = CATEGORY_ORDER.indexOf(b.handle);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

  const collections = storeEdges.map(({ node: c }: any) => ({
    title: c.title,
    value: c.handle,
  }));

  const categoryMenus = storeEdges.map(({ node: c }: any) => ({
    title: c.title,
    href: `/collections/${c.handle}`,
    icon: "ShoppingBag",
    value: c.handle,
    image: c.image?.url || null,
    productCount: c.productsCount?.count ?? 0,
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
