// src/app/robots.ts

import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout/",
          "/payment/",
          "/order-confirmation/",
          "/profile/",
          "/orders/",
          "/address/",
          "/wish-list/",
          "/support-tickets/",
          "/mini-cart/",
          "/mobile-categories/",
          "/login/",
          "/register/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
