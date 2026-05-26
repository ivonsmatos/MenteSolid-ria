import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Saúde mental gratuita`,
    short_name: SITE_NAME,
    description: SITE_TAGLINE,
    lang: 'pt-BR',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f8fafc',
    theme_color: '#1d4ed8',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon-maskable.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable'
      }
    ],
    categories: ['health', 'medical', 'social']
  };
}
