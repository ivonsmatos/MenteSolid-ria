import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { PapelUsuario } from '@/types';

export async function HeaderNav() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user ?? null;
  const papel = (user?.app_metadata?.role ?? 'anonimo') as PapelUsuario;
  const autenticado = Boolean(user);
  const pode = (p: PapelUsuario[]) => p.includes(papel);

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 p-4">
        <Link className="text-lg font-bold text-blue-700" href="/">
          🧠 MenteSolidária
        </Link>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {pode(['profissional', 'admin']) ? <Link href="/painel">Painel</Link> : null}
          {pode(['profissional', 'admin']) ? <Link href="/pacientes">Pacientes</Link> : null}
          {pode(['profissional', 'admin']) ? <Link href="/profissionais">Profissionais</Link> : null}
          {pode(['profissional']) ? <Link href="/painel/certificado">Certificado</Link> : null}
          {!autenticado ? (
            <>
              <Link href="/acolhimento">Acolhimento</Link>
              <Link href="/diretorio">Diretório</Link>
              <Link className="rounded bg-blue-600 px-3 py-1 text-white" href="/login">
                Entrar
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-slate-600">
                {user?.email} · <em>{papel}</em>
              </span>
              <form action="/api/auth/signout" method="post">
                <button
                  className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-100"
                  type="submit"
                >
                  Sair
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
