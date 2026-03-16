// DESTINATION: src/utils/__api__/layout.ts
import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import storeConfig from "config/store.config";

const getLayoutData = cache(async () => {
  const data = await storefrontQuery(
    `query { collections(first: 50, sortKey: TITLE) { edges { node { id title handle } } } }`,
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
    children: [],
  }));

  return {
    header: {
      logo: storeConfig.logo,
      categories: collections,
      categoryMenus,
      navigation: [],
    },
    footer: {
      logo: storeConfig.logo,
      description: storeConfig.footerDescription,
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
        { title: "Corporate & Bulk Orders", url: `/mailto:${storeConfig.email}` },
      ],
      socials: {
        google:    storeConfig.social.google,
        twitter:   storeConfig.social.twitter,
        youtube:   storeConfig.social.youtube,
        facebook:  storeConfig.social.facebook,
        instagram: storeConfig.social.instagram,
      },
      contact: {
        phone:   storeConfig.phone,
        email:   storeConfig.email,
        address: storeConfig.address,
      },
    },
    topbar: {
      title: "Free Express Shipping on Orders Over $99",
      label: "HOT",
      socials: {},
      languageOptions: { en: { title: "EN", value: "en" } },
    },
    mobileNavigation: {
      logo: storeConfig.logo,
      version1: [
        { title: "Home",    icon: "Home",                href: "/",                  badge: false },
        { title: "Shop",    icon: "CategoryOutlined",    href: "/mobile-categories", badge: false },
        { title: "Cart",    icon: "ShoppingBagOutlined", href: "/cart",              badge: true  },
        { title: "Account", icon: "User2",               href: "/profile",           badge: false },
      ],
      version2: [],
    },
  };
});

export default { getLayoutData };
