'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { PainelCaso, TriagemStatus } from '@/types';

const LABEL_STATUS: Record<TriagemStatus, string> = {
  novo: 'Novo',
  em_atendimento: 'Em atendimento',
  encaminhado: 'Encaminhado',
  encerrado: 'Encerrado'
};

const COR_STATUS: Record<TriagemStatus, string> = {
  novo: 'bg-blue-100 text-blue-900',
  em_atendimento: 'bg-amber-100 text-amber-900',
  encaminhado: 'bg-emerald-100 text-emerald-900',
  encerrado: 'bg-slate-200 text-slate-700'
};

interface Props {
  casos: { meus: PainelCaso[]; novos: PainelCaso[]; outros: PainelCaso[] };
  meuProfissionalId: string | null;
}

export function PainelClient({ casos, meuProfissionalId }: Props) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [trabalhando, startTransition] = useTransition();

  const chamarApi = async (triagemId: string, body: object) => {
    setErro(null);
    const response = await fetch(`/api/triagens/${triagemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setErro(payload.error ?? 'Falha ao atualizar caso.');
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-8">
      {erro ? <p className="text-sm text-red-600">{erro}</p> : null}

      <Bloco
        casos={casos.meus}
        descricao="Casos que você assumiu."
        meuProfissionalId={meuProfissionalId}
        onAction={chamarApi}
        titulo="Meus casos"
        trabalhando={trabalhando}
      />
      <Bloco
        casos={casos.novos}
        descricao="Aguardando profissional voluntário. Clique para assumir."
        meuProfissionalId={meuProfissionalId}
        onAction={chamarApi}
        titulo="Fila de novos casos"
        trabalhando={trabalhando}
      />
      {casos.outros.length ? (
        <Bloco
          casos={casos.outros}
          descricao="(Visão admin) Casos atribuídos a outros profissionais."
          meuProfissionalId={meuProfissionalId}
          onAction={chamarApi}
          titulo="Outros profissionais"
          trabalhando={trabalhando}
        />
      ) : null}
    </div>
  );
}

interface BlocoProps {
  titulo: string;
  descricao: string;
  casos: PainelCaso[];
  meuProfissionalId: string | null;
  trabalhando: boolean;
  onAction: (triagemId: string, body: object) => Promise<void>;
}

function Bloco({ titulo, descricao, casos, meuProfissionalId, trabalhando, onAction }: BlocoProps) {
  return (
    <section aria-labelledby={`s-${titulo}`} className="space-y-3">
      <header>
        <h2 className="text-xl font-semibold" id={`s-${titulo}`}>{titulo}</h2>
        <p className="text-sm text-slate-600">{descricao}</p>
      </header>
      {casos.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum caso aqui.</p>
      ) : (
        <ul className="space-y-2">
          {casos.map((c) => (
            <li
              className={`rounded border bg-white p-4 shadow-sm ${
                c.sinalDeAlerta ? 'border-l-4 border-red-600' : 'border-slate-200'
              }`}
              key={c.triagemId}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      className="font-semibold text-blue-700 hover:underline"
                      href={`/pacientes/${c.pacienteId}`}
                    >
                      {c.pacienteNome}
                    </Link>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${COR_STATUS[c.status]}`}
                    >
                      {LABEL_STATUS[c.status]}
                    </span>
                    {c.sinalDeAlerta ? (
                      <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                        Prioritário
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-600">
                    {c.pacienteCidade} - {c.pacienteUf} · indicado: {c.perfilIndicado} · criado{' '}
                    {new Date(c.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.profissionalId === null && meuProfissionalId ? (
                    <button
                      className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
                      disabled={trabalhando}
                      onClick={() => onAction(c.triagemId, { claim: true, status: 'em_atendimento' })}
                      type="button"
                    >
                      Assumir
                    </button>
                  ) : null}
                  {c.profissionalId === meuProfissionalId && c.status === 'em_atendimento' ? (
                    <>
                      <button
                        className="rounded border border-emerald-600 px-3 py-1 text-sm font-medium text-emerald-700 disabled:opacity-60"
                        disabled={trabalhando}
                        onClick={() => onAction(c.triagemId, { status: 'encaminhado' })}
                        type="button"
                      >
                        Marcar encaminhado
                      </button>
                      <button
                        className="rounded border border-slate-400 px-3 py-1 text-sm font-medium text-slate-700 disabled:opacity-60"
                        disabled={trabalhando}
                        onClick={() => onAction(c.triagemId, { status: 'encerrado' })}
                        type="button"
                      >
                        Encerrar
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
