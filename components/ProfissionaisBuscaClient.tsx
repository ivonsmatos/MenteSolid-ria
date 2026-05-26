'use client';

import { useMemo, useState } from 'react';
import type { Profissional } from '@/types';

export function ProfissionaisBuscaClient({ profissionais }: { profissionais: Profissional[] }) {
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return profissionais;
    return profissionais.filter((p) => p.nome.toLowerCase().includes(termo));
  }, [busca, profissionais]);

  return (
    <>
      <input
        aria-label="Buscar profissional por nome"
        className="w-full rounded border bg-white p-2"
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome"
        value={busca}
      />

      <div className="space-y-3">
        {filtrados.map((p) => (
          <article className="rounded bg-white p-4 shadow" key={p.id}>
            <h2 className="font-semibold">{p.nome}</h2>
            <p className="text-sm text-slate-600">{p.email}</p>
            <p className="text-sm text-slate-600">
              {p.especialidade} • {p.numeroRegistro} {p.ativo ? '' : '(inativo)'}
            </p>
          </article>
        ))}
        {!filtrados.length ? <p className="text-slate-600">Nenhum profissional encontrado.</p> : null}
      </div>
    </>
  );
}
