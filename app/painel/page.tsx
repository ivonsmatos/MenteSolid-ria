import type { Metadata } from 'next';
import { getPapel, getSessionUser, getSupabaseServer } from '@/lib/supabase/server';
import { painelCasoFromRow } from '@/lib/mappers';
import { PainelClient } from '@/components/PainelClient';
import type { PainelCaso } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Painel do profissional',
  description: 'Casos atribuídos a você e fila de novos casos.',
  robots: { index: false, follow: false }
};

export default async function PainelPage() {
  const supabase = await getSupabaseServer();
  const user = await getSessionUser();
  const papel = await getPapel();

  let meuProfissionalId: string | null = null;
  if (user?.id) {
    const { data } = await supabase
      .from('profissionais')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    meuProfissionalId = (data as { id: string } | null)?.id ?? null;
  }

  const { data: rows, error } = await supabase
    .from('v_painel_casos')
    .select('*')
    .order('sinal_de_alerta', { ascending: false })
    .order('criado_em', { ascending: false });

  if (error) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Painel</h1>
        <p className="text-red-700">Erro ao carregar painel: {error.message}</p>
      </section>
    );
  }

  const casos: PainelCaso[] = (rows ?? []).map((r) =>
    painelCasoFromRow(r as Parameters<typeof painelCasoFromRow>[0])
  );

  const meus = casos.filter((c) => c.profissionalId && c.profissionalId === meuProfissionalId);
  const novos = casos.filter((c) => !c.profissionalId);
  const outros = casos.filter(
    (c) => c.profissionalId && c.profissionalId !== meuProfissionalId
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Painel do profissional</h1>
        <p className="text-sm text-slate-600">
          {papel === 'admin' ? 'Visão de administrador — todos os casos.' : null}
          {meuProfissionalId
            ? null
            : ' Você ainda não tem perfil de profissional vinculado. Solicite ao admin.'}
        </p>
      </header>
      <PainelClient
        casos={{ meus, novos, outros: papel === 'admin' ? outros : [] }}
        meuProfissionalId={meuProfissionalId}
      />
    </section>
  );
}
