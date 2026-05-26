import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase/server';
import { pacienteFromRow, profissionalFromRow, triagemFromRow } from '@/lib/mappers';
import { TriagemForm } from '@/components/TriagemForm';
import { AlertaPrioridade } from '@/components/AlertaPrioridade';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function PacienteDetalhePage({ params }: Props) {
  const { id } = await params;
  const supabase = await getSupabaseServer();

  const { data: row } = await supabase
    .from('pacientes')
    .select('*, triagens(*)')
    .eq('id', id)
    .maybeSingle();

  if (!row) notFound();

  const triagensArr = (row as { triagens?: unknown[] | null }).triagens ?? [];
  const ultima = Array.isArray(triagensArr) && triagensArr.length
    ? triagemFromRow(triagensArr[0] as Parameters<typeof triagemFromRow>[0])
    : null;
  const paciente = pacienteFromRow(row as Parameters<typeof pacienteFromRow>[0], ultima as never);

  // Se há profissional atribuído, busca para exibir Cal.com.
  let profissionalAtribuido = null;
  if (ultima?.profissionalId) {
    const { data: profRow } = await supabase
      .from('profissionais')
      .select('*')
      .eq('id', ultima.profissionalId)
      .maybeSingle();
    if (profRow) {
      profissionalAtribuido = profissionalFromRow(
        profRow as Parameters<typeof profissionalFromRow>[0]
      );
    }
  }

  return (
    <section className="space-y-6">
      {paciente.triagem?.sinalDeAlerta ? <AlertaPrioridade /> : null}

      <div className="rounded bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">{paciente.nome}</h1>
        <p>{paciente.email}</p>
        <p>{paciente.telefone}</p>
        <p>{paciente.cidade} - {paciente.uf}</p>
        {paciente.triagem?.status ? (
          <p className="mt-2 text-sm">
            Status: <strong>{paciente.triagem.status}</strong>
          </p>
        ) : null}
      </div>

      {profissionalAtribuido ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-900">
            Caso atribuído a {profissionalAtribuido.nome}
          </p>
          <p className="text-sm text-emerald-800">
            {profissionalAtribuido.especialidade} · {profissionalAtribuido.numeroRegistro}
          </p>
          {profissionalAtribuido.calLink ? (
            <Link
              className="mt-2 inline-block rounded bg-emerald-700 px-3 py-1 text-sm font-semibold text-white hover:bg-emerald-800"
              href={profissionalAtribuido.calLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Agendar atendimento pelo Cal.com
            </Link>
          ) : (
            <p className="mt-2 text-xs text-emerald-700">
              Profissional ainda não cadastrou link de agendamento.
            </p>
          )}
        </div>
      ) : null}

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Triagem inicial</h2>
        <TriagemForm pacienteId={paciente.id} triagemAtual={paciente.triagem ?? null} />
      </div>

      {paciente.triagem ? (
        <div className="rounded bg-white p-4 shadow">
          <h3 className="font-semibold">Resumo de encaminhamento</h3>
          <p className="mt-2 text-sm text-slate-700">
            Perfil indicado: <strong>{paciente.triagem.perfilIndicado}</strong>
          </p>
          <p className="text-sm text-slate-700">
            Sinal de alerta: {paciente.triagem.sinalDeAlerta ? 'Sim' : 'Não'}
          </p>
        </div>
      ) : null}
    </section>
  );
}
