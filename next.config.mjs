/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudflare Pages: o otimizador do Next exige Worker pesado. Como o CDN
    // do Unsplash já serve AVIF/WebP via `auto=format`, optamos por servir
    // direto. Trade-off: sem geração responsiva automática (mantemos `sizes`).
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // HSTS: 6 meses, ativar gradualmente em produção real.
          { key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains' }
        ]
      }
    ];
  }
};

export default nextConfig;
