/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "ui-lib.com" },
      // Vercel Blob — store assets (logos, hero images)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  allowedDevOrigins: ["farreachingly-manlier-liam.ngrok-free.dev"],
  experimental: { staleTimes: { dynamic: 0 } },
};
module.exports = nextConfig;
