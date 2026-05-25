/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 300
  },
  env: {
    NEXT_ON_PAGES_ADAPTER: '@cloudflare/next-on-pages'
  }
};

export default nextConfig;
