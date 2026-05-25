'use client';

interface EncaminhamentoItem {
  id: string;
  paciente_id: string;
  resumo_clinico?: string;
  status: string;
}

interface FilaEncaminhamentosProps {
  encaminhamentos: EncaminhamentoItem[];
  onAtualizarStatus: (id: string, status: string) => Promise<void>;
}

const statusClass: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  aceito: 'bg-emerald-100 text-emerald-800',
  recusado: 'bg-red-100 text-red-800',
  mais_informacoes: 'bg-blue-100 text-blue-800'
};

export function FilaEncaminhamentos({
  encaminhamentos,
  onAtualizarStatus
}: FilaEncaminhamentosProps) {
  return (
    <div className="space-y-3">
      {encaminhamentos.map((item) => (
        <article className="rounded-lg bg-white p-4 shadow" key={item.id}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Paciente #{item.paciente_id}</p>
              <p className="text-sm text-slate-700">{item.resumo_clinico ?? 'Resumo indisponível'}</p>
            </div>
            <span className={`rounded px-2 py-1 text-xs font-medium ${statusClass[item.status] ?? 'bg-slate-100'}`}>
              {item.status}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="rounded border px-3 py-1 text-sm"
              onClick={() => onAtualizarStatus(item.id, 'aceito')}
              type="button"
            >
              Aceitar
            </button>
            <button
              className="rounded border px-3 py-1 text-sm"
              onClick={() => onAtualizarStatus(item.id, 'recusado')}
              type="button"
            >
              Recusar
            </button>
            <button
              className="rounded border px-3 py-1 text-sm"
              onClick={() => onAtualizarStatus(item.id, 'mais_informacoes')}
              type="button"
            >
              Solicitar mais informações
            </button>
          </div>
        </article>
      ))}

      {!encaminhamentos.length ? (
        <p className="rounded bg-white p-4 text-sm text-slate-600 shadow">
          Nenhum encaminhamento recebido no momento.
        </p>
      ) : null}
    </div>
  );
}
