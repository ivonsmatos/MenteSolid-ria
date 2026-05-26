'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Paciente } from '@/types';

export function PacientesBuscaClient({ pacientes }: { pacientes: Paciente[] }) {
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return pacientes;
    return pacientes.filter((p) => p.nome.toLowerCase().includes(termo));
  }, [busca, pacientes]);

  const prioritarios = filtrados.filter((p) => p.triagem?.sinalDeAlerta);
  const demais = filtrados.filter((p) => !p.triagem?.sinalDeAlerta);

  return (
    <>
      <input
        aria-label="Buscar paciente por nome"
        className="w-full rounded border bg-white p-2"
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome"
        value={busca}
      />

      {prioritarios.length ? (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-red-700">
            Casos prioritários
          </h2>
          {prioritarios.map((p) => (
            <PacienteCard key={p.id} paciente={p} prioritario />
          ))}
        </div>
      ) : null}

      <div className="space-y-2">
        {demais.map((p) => (
          <PacienteCard key={p.id} paciente={p} />
        ))}
        {!filtrados.length ? <p className="text-slate-600">Nenhum paciente encontrado.</p> : null}
      </div>
    </>
  );
}

function PacienteCard({ paciente, prioritario }: { paciente: Paciente; prioritario?: boolean }) {
  return (
    <article
      className={`rounded bg-white p-4 shadow ${prioritario ? 'border-l-4 border-red-600' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">{paciente.nome}</h3>
          <p className="text-sm text-slate-600">{paciente.email}</p>
          <p className="text-sm text-slate-600">
            {paciente.cidade} - {paciente.uf}
          </p>
        </div>
        <Link className="text-blue-700 underline" href={`/pacientes/${paciente.id}`}>
          Ver detalhe
        </Link>
      </div>
      {prioritario ? (
        <p className="mt-2 text-sm font-semibold text-red-700">⚠ Caso prioritário</p>
      ) : null}
    </article>
  );
}
