import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase/server';
import { pacienteFromRow, triagemFromRow } from '@/lib/mappers';
import { PacientesBuscaClient } from '@/components/PacientesBuscaClient';

export const dynamic = 'force-dynamic';

export default async function PacientesPage() {
  const supabase = await getSupabaseServer();
  const { data: rows, error } = await supabase
    .from('pacientes')
    .select('*, triagens(*)')
    .order('criado_em', { ascending: false });

  if (error) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <p className="text-red-700">Erro ao carregar pacientes: {error.message}</p>
      </section>
    );
  }

  const pacientes = (rows ?? []).map((r) => {
    const triagensArr = (r as { triagens?: unknown[] | null }).triagens ?? [];
    const ultima = Array.isArray(triagensArr) && triagensArr.length
      ? triagemFromRow(triagensArr[0] as Parameters<typeof triagemFromRow>[0])
      : null;
    return pacienteFromRow(r as Parameters<typeof pacienteFromRow>[0], ultima as never);
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Link className="rounded bg-blue-600 px-4 py-2 text-white" href="/pacientes/novo">
          Novo paciente
        </Link>
      </div>
      <PacientesBuscaClient pacientes={pacientes} />
    </section>
  );
}
