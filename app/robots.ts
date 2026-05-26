import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/acolhimento', '/cadastro-paciente', '/diretorio', '/politica-lgpd', '/login'],
        disallow: ['/api/', '/pacientes/', '/profissionais/']
      }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
