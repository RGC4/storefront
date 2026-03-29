import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import storeConfig from "config/store.config";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const getLayoutData = cache(async () => {
  // Fetch all collections with their first product's tags
  const data = await storefrontQuery(
    `query {
      collections(first: 50, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            products(first: 1) {
              edges {
                node {
                  tags
                }
              }
            }
          }
        }
      }
    }`,
    {}
  );

  // Only show collections whose products have our store tag
  const storeCollections = data.collections.edges
    .filter(({ node: c }: any) => {
      const firstProduct = c.products?.edges?.[0]?.node;
      if (!firstProduct) return false;
      return firstProduct.tags?.includes(STORE_ID);
    })
    .map(({ node: c }: any) => c);

  const collections = storeCollections.map((c: any) => ({
    title: c.title,
    value: c.handle,
  }));

  const categoryMenus = storeCollections.map((c: any) => ({
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
        { title: "About Us",               url: "/about" },
        { title: "Corporate & Bulk Orders", url: "/contact" },
      ],
      customers: [
        { title: "Contact Us",          url: "/contact" },
        { title: "Track Your Order",    url: "/order-lookup" },
        { title: "Returns & Exchanges", url: "/returns" },
      ],
      policies: [
        { title: "Terms & Conditions", url: "/policies/s1_terms_and_conditions.html" },
        { title: "Privacy Policy",     url: "/policies/s1_privacy_policy.html" },
        { title: "Shipping Policy",    url: "/policies/s1_shipping_policy.html" },
        { title: "Refund Policy",      url: "/policies/s1_refund_policy.html" },
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
      languageOptions: {
        en: { title: "EN", value: "en" },
      },
    },
    mobileNavigation: {
      logo: storeConfig.logo,
      version1: [
        { title: "Home",     icon: "Home",                href: "/",                 badge: false },
        { title: "Shop",     icon: "CategoryOutlined",    href: "/mobile-categories", badge: false },
        { title: "Cart",     icon: "ShoppingBagOutlined", href: "/cart",             badge: true  },
        { title: "Account",  icon: "User2",               href: "/profile",          badge: false },
      ],
      version2: [],
    },
  };
});

export default { getLayoutData };
