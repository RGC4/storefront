<<<<<<< HEAD
// DESTINATION: src/utils/__api__/layout.ts
=======
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import storeConfig from "config/store.config";

const getLayoutData = cache(async () => {
<<<<<<< HEAD
=======
  // Dynamically fetch all collections from Shopify
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
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
<<<<<<< HEAD
      logo: "/assets/stores/s1/logo/logo-2.png",
      description: storeConfig.footerDescription,
      appStoreUrl: "",
      playStoreUrl: "",
      about: [
        { title: "About Us",           url: "#" },
        { title: "Terms & Conditions", url: "#" },
        { title: "Privacy Policy",     url: "#" },
      ],
      customers: [
        { title: "Contact Us",          url: "/contact" },
        { title: "Track Your Order",    url: "/order-lookup" },
        { title: "Returns & Exchanges", url: "/returns" },
      ],
      socials: {
        google:    storeConfig.social.google,
        twitter:   storeConfig.social.twitter,
        youtube:   storeConfig.social.youtube,
        facebook:  storeConfig.social.facebook,
        instagram: storeConfig.social.instagram,
      },
      contact: {
        email:   storeConfig.email,
=======
      logo: storeConfig.logo,
      description: storeConfig.footerDescription,
      appStoreUrl: "#",
      playStoreUrl: "#",
      about: [],
      customers: [],
      socials: {
        google: storeConfig.social.google,
        twitter: storeConfig.social.twitter,
        youtube: storeConfig.social.youtube,
        facebook: storeConfig.social.facebook,
        instagram: storeConfig.social.instagram,
      },
      contact: {
        phone: storeConfig.phone,
        email: storeConfig.email,
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
        address: storeConfig.address,
      },
    },
    topbar: {
<<<<<<< HEAD
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
=======
      title: "Free Express Shipping",
      label: "HOT",
      socials: {},
      languageOptions: {
        en: { title: "EN", value: "en" },
      },
    },
    mobileNavigation: {
      logo: storeConfig.logo,
      version1: [],
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      version2: [],
    },
  };
});

export default { getLayoutData };
