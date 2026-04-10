/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  // Needed for wavesurfer.js
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'wavesurfer.js': 'wavesurfer.js/dist/wavesurfer.js',
    }
    return config
  },
}

module.exports = nextConfig
