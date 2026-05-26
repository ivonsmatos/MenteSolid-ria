import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const agora = new Date();

  return [
    { url: `${base}/`,                  lastModified: agora, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/acolhimento`,       lastModified: agora, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${base}/cadastro-paciente`, lastModified: agora, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/para-pacientes`,    lastModified: agora, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/para-profissionais`,lastModified: agora, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/como-funciona`,     lastModified: agora, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/sobre`,             lastModified: agora, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/diretorio`,         lastModified: agora, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/faq`,               lastModified: agora, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/impacto`,           lastModified: agora, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contato`,           lastModified: agora, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/politica-lgpd`,     lastModified: agora, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/login`,             lastModified: agora, changeFrequency: 'yearly',  priority: 0.3 }
  ];
}
