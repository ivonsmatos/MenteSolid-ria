import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getSupabaseServer } from '@/lib/supabase/server';
import { SITE_NAME } from '@/lib/seo';
import type { PapelUsuario } from '@/types';

interface LinkItem { href: string; label: string }

const LINKS_PUBLICOS: LinkItem[] = [
  { href: '/acolhimento',       label: 'Acolhimento' },
  { href: '/como-funciona',     label: 'Como funciona' },
  { href: '/para-pacientes',    label: 'Pacientes' },
  { href: '/para-profissionais',label: 'Profissionais' },
  { href: '/diretorio',         label: 'Diretório' },
  { href: '/sobre',             label: 'Sobre' }
];

const LINKS_AUTENTICADOS: Array<{ links: LinkItem[]; papeis: PapelUsuario[] }> = [
  { papeis: ['profissional', 'admin'], links: [{ href: '/painel', label: 'Painel' }] },
  { papeis: ['profissional', 'admin'], links: [{ href: '/pacientes', label: 'Pacientes' }] },
  { papeis: ['profissional', 'admin'], links: [{ href: '/profissionais', label: 'Profissionais' }] },
  { papeis: ['profissional'],          links: [{ href: '/painel/certificado', label: 'Certificado' }] }
];

export async function HeaderNav() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user ?? null;
  const papel = (user?.app_metadata?.role ?? 'anonimo') as PapelUsuario;
  const autenticado = Boolean(user);

  return (
    <header className="sticky top-0 z-30 border-b border-mint-100 bg-cream/90 backdrop-blur" role="banner">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
        <Link className="inline-flex items-center gap-2 text-lg font-bold text-coral" href="/">
          <Heart aria-hidden className="h-5 w-5 fill-coral" />
          {SITE_NAME}
        </Link>
        <nav aria-label="Navegação principal" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {!autenticado ? (
            <>
              {LINKS_PUBLICOS.map((l) => (
                <Link className="text-slate-700 hover:text-coral" href={l.href} key={l.href}>
                  {l.label}
                </Link>
              ))}
              <Link className="btn-primary !px-4 !py-2 text-sm" href="/login">Entrar</Link>
            </>
          ) : (
            <>
              {LINKS_AUTENTICADOS
                .filter((g) => g.papeis.includes(papel))
                .flatMap((g) => g.links)
                .map((l) => (
                  <Link className="text-slate-700 hover:text-coral" href={l.href} key={l.href}>
                    {l.label}
                  </Link>
                ))}
              <span className="hidden text-xs text-slate-500 sm:inline">
                {user?.email} · <em>{papel}</em>
              </span>
              <form action="/api/auth/signout" method="post">
                <button className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100" type="submit">
                  Sair
                </button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
