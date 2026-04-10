
// src/utils/__api__/layout.ts
import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import { getStoreConfig } from "@/lib/storeResolver";
import storeConfig from "config/store.config";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const getLayoutData = cache(async () => {
  const { storeId } = getStoreConfig();

  const data = await storefrontQuery(
    `query {
      collections(first: 50, sortKey: TITLE) {
        edges { node { id title handle
          products(first: 1) { edges { node { tags } } }
        } }
      }
    }`,
    {}
  );

  const storeCollections = data.collections.edges
    .filter(({ node }: any) =>
      node.products?.edges?.[0]?.node?.tags?.includes(storeId)
    )
    .map(({ node }: any) => ({
      id: node.id, title: node.title, handle: node.handle,
    }));

  const categoryMenus = storeCollections.map((col: any) => ({
    title: col.title,
    value: col.handle,
  }));

  return {
    collections: storeCollections,

    header: {
      logo: storeConfig.logoHeader || `/assets/stores/${STORE_ID}/logo/logo-header.jpg`,
      categories: categoryMenus,
      categoryMenus,
      navigation: [],
    },

    footer: {
      logo: storeConfig.logoFooter || `/assets/stores/${STORE_ID}/logo/logo-footer.jpg`,
      description: storeConfig.footerDescription || "",
      appStoreUrl: "",
      playStoreUrl: "",
      about: [
        { title: "About Us",       url: "/about" },
        { title: "Contact Us",     url: "/contact" },
      ],
      customers: [
        { title: "Track Order",    url: "/order-lookup" },
        { title: "Help Center",    url: "/contact" },
        { title: "Returns",        url: "/returns" },
      ],
      policies: [
        { title: "Privacy Policy",       url: "/privacy-policy" },
        { title: "Terms and Conditions", url: "/terms" },
        { title: "Refund Policy",        url: "/return-policy" },
        { title: "Shipping Policy",      url: "/shipping-policy" },
      ],
      socials: storeConfig.social || {
        facebook: "", instagram: "", twitter: "", youtube: "", google: "",
      },
      contact: {
        phone:   storeConfig.phone   || "",
        email:   storeConfig.email   || "",
        address: storeConfig.address || "",
      },
    },

    topbar: {
      title: storeConfig.name || "Store",
      label: "",
      socials: storeConfig.social || {},
      languageOptions: {},
    },

    mobileNavigation: {
      logo: storeConfig.logoHeader || `/assets/stores/${STORE_ID}/logo/logo-header.jpg`,
      version1: [
        { title: "Home",       icon: "Home",              href: "/",            badge: false },
        { title: "Category",   icon: "CategoryOutlined",  href: "/collections", badge: false },
        { title: "Cart",       icon: "ShoppingBag",       href: "/cart",        badge: true  },
        { title: "Account",    icon: "User2",             href: "/profile",     badge: false },
      ],
      version2: [],
    },
  };
});

export default { getLayoutData };
