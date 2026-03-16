/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "ui-lib.com" },
    ],
  },
  experimental: { staleTimes: { dynamic: 0 } },
};

module.exports = nextConfig;
