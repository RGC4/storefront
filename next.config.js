/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "ui-lib.com" },
    ],
  },
  allowedDevOrigins: ["farreachingly-manlier-liam.ngrok-free.dev"],
  experimental: { staleTimes: { dynamic: 0 } },
};
module.exports = nextConfig;
