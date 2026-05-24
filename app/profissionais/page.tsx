'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Profissional } from '@/types';

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/profissionais');
      const data = (await response.json()) as Profissional[];
      setProfissionais(data);
    };

    void load();
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return profissionais;
    }

    return profissionais.filter((profissional) => profissional.nome.toLowerCase().includes(termo));
  }, [busca, profissionais]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Profissionais voluntários</h1>
        <Link className="rounded bg-blue-600 px-4 py-2 text-white" href="/profissionais/novo">
          Novo profissional
        </Link>
      </div>

      <input
        className="w-full rounded border bg-white p-2"
        onChange={(event) => setBusca(event.target.value)}
        placeholder="Buscar por nome"
        value={busca}
      />

      <div className="space-y-3">
        {filtrados.map((profissional) => (
          <article className="rounded bg-white p-4 shadow" key={profissional.id}>
            <h2 className="font-semibold">{profissional.nome}</h2>
            <p className="text-sm text-slate-600">{profissional.email}</p>
            <p className="text-sm text-slate-600">
              {profissional.especialidade} • {profissional.numeroRegistro}
            </p>
          </article>
        ))}
        {!filtrados.length ? <p className="text-slate-600">Nenhum profissional encontrado.</p> : null}
      </div>
    </section>
  );
}
