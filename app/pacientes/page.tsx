'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Paciente } from '@/types';

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/pacientes');
      const data = (await response.json()) as Paciente[];
      setPacientes(data);
    };

    void load();
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return pacientes;
    }

    return pacientes.filter((paciente) => paciente.nome.toLowerCase().includes(termo));
  }, [busca, pacientes]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Link className="rounded bg-blue-600 px-4 py-2 text-white" href="/pacientes/novo">
          Novo paciente
        </Link>
      </div>

      <input
        className="w-full rounded border bg-white p-2"
        onChange={(event) => setBusca(event.target.value)}
        placeholder="Buscar por nome"
        value={busca}
      />

      <div className="space-y-3">
        {filtrados.map((paciente) => (
          <article className="rounded bg-white p-4 shadow" key={paciente.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{paciente.nome}</h2>
                <p className="text-sm text-slate-600">{paciente.email}</p>
                <p className="text-sm text-slate-600">{paciente.cidade} - {paciente.estado}</p>
              </div>
              <Link className="text-blue-700 underline" href={`/pacientes/${paciente.id}`}>
                Ver detalhe
              </Link>
            </div>
            {paciente.triagem?.sinalDeAlerta ? (
              <p className="mt-2 text-sm font-semibold text-red-700">⚠ Caso prioritário</p>
            ) : null}
          </article>
        ))}
        {!filtrados.length ? <p className="text-slate-600">Nenhum paciente encontrado.</p> : null}
      </div>
    </section>
  );
}
