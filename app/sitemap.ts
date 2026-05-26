import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const agora = new Date();

  return [
    { url: `${base}/`,                  lastModified: agora, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/acolhimento`,       lastModified: agora, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${base}/cadastro-paciente`, lastModified: agora, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/diretorio`,         lastModified: agora, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/login`,             lastModified: agora, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/politica-lgpd`,     lastModified: agora, changeFrequency: 'yearly',  priority: 0.5 }
  ];
}
