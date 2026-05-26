import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      // Permitidos: páginas públicas; bloqueados: API e áreas autenticadas.
      {
        userAgent: '*',
        allow: [
          '/',
          '/acolhimento',
          '/cadastro-paciente',
          '/para-pacientes',
          '/para-profissionais',
          '/como-funciona',
          '/sobre',
          '/diretorio',
          '/faq',
          '/impacto',
          '/contato',
          '/politica-lgpd',
          '/login'
        ],
        disallow: ['/api/', '/pacientes/', '/profissionais/', '/painel/']
      },
      // Liberação explícita para crawlers de IA (GEO). Pode ser ajustada caso a equipe deseje opt-out.
      { userAgent: 'GPTBot',        allow: '/' },
      { userAgent: 'ChatGPT-User',  allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot',         allow: '/' },
      { userAgent: 'anthropic-ai',  allow: '/' },
      { userAgent: 'ClaudeBot',     allow: '/' }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
