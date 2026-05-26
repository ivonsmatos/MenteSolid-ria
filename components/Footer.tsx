import Link from 'next/link';
import { Heart, Mail, Phone } from 'lucide-react';
import { SITE_NAME } from '@/lib/seo';

interface LinkItem { href: string; label: string }

const COLUNAS: Array<{ titulo: string; links: LinkItem[] }> = [
  {
    titulo: 'Para quem precisa de apoio',
    links: [
      { href: '/acolhimento', label: 'Conversar agora' },
      { href: '/cadastro-paciente', label: 'Fazer cadastro' },
      { href: '/diretorio', label: 'Diretório de serviços' },
      { href: '/para-pacientes', label: 'Como funciona pra mim' }
    ]
  },
  {
    titulo: 'Para profissionais',
    links: [
      { href: '/para-profissionais', label: 'Seja voluntário' },
      { href: '/login', label: 'Entrar' },
      { href: '/impacto', label: 'Nosso impacto' }
    ]
  },
  {
    titulo: 'Sobre',
    links: [
      { href: '/sobre', label: 'Quem somos' },
      { href: '/como-funciona', label: 'Como funciona' },
      { href: '/faq', label: 'Perguntas frequentes' },
      { href: '/contato', label: 'Contato' },
      { href: '/politica-lgpd', label: 'Política de privacidade' }
    ]
  }
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-mint-200 bg-cream-100" role="contentinfo">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <Link className="inline-flex items-center gap-2 text-lg font-bold text-coral" href="/">
              <Heart aria-hidden className="h-5 w-5 fill-coral" />
              {SITE_NAME}
            </Link>
            <p className="text-sm text-slate-700">
              Plataforma social que conecta pessoas em vulnerabilidade a profissionais voluntários de saúde mental no Brasil.
            </p>
            <p className="text-xs text-slate-500">CNPJ em formação · pt-BR</p>
          </div>
          {COLUNAS.map((col) => (
            <nav aria-label={col.titulo} className="space-y-3" key={col.titulo}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-mint-700">
                {col.titulo}
              </h2>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link className="text-slate-700 hover:text-coral hover:underline" href={l.href}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 grid gap-3 border-t border-mint-200 pt-6 text-sm text-slate-700 md:grid-cols-2">
          <p className="flex items-center gap-2">
            <Mail aria-hidden className="h-4 w-4" />
            <a className="hover:text-coral hover:underline" href="mailto:contato@mentesolidaria.org">
              contato@mentesolidaria.org
            </a>
          </p>
          <p className="flex items-center gap-2 md:justify-end">
            <Phone aria-hidden className="h-4 w-4 text-coral" />
            <span>
              Em crise? Ligue para o <a className="font-semibold text-coral hover:underline" href="tel:188">CVV 188</a> — gratuito, 24 horas.
            </span>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE_NAME}. Conteúdo educacional, não substitui atendimento médico ou psicológico profissional.
        </p>
      </div>
    </footer>
  );
}
