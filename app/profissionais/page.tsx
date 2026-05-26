import Link from 'next/link';
import { getPapel, getSupabaseServer } from '@/lib/supabase/server';
import { profissionalFromRow } from '@/lib/mappers';
import { ProfissionaisBuscaClient } from '@/components/ProfissionaisBuscaClient';

export const dynamic = 'force-dynamic';

export default async function ProfissionaisPage() {
  const supabase = await getSupabaseServer();
  const papel = await getPapel();

  const { data: rows } = await supabase
    .from('profissionais')
    .select('*')
    .order('criado_em', { ascending: false });

  const profissionais = (rows ?? []).map((r) =>
    profissionalFromRow(r as Parameters<typeof profissionalFromRow>[0])
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Profissionais voluntários</h1>
        {papel === 'admin' ? (
          <Link className="rounded bg-blue-600 px-4 py-2 text-white" href="/profissionais/novo">
            Novo profissional
          </Link>
        ) : null}
      </div>
      <ProfissionaisBuscaClient profissionais={profissionais} />
    </section>
  );
}
