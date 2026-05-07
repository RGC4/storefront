const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  allowedDevOrigins: ["farreachingly-manlier-liam.ngrok-free.dev"],
  turbopack: {
    root: __dirname,
  },
};
module.exports = nextConfig;
