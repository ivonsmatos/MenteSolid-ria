'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';

interface PacienteDashboard {
  id: string;
  nome: string;
  nivel_prioridade?: string;
  ultima_triagem?: string;
}

function anonimizarNome(nome: string): string {
  const partes = nome.split(' ');
  if (partes.length <= 1) {
    return `${nome.slice(0, 2)}***`;
  }

  const primeiro = partes[0];
  const ultimo = partes[partes.length - 1];
  return `${primeiro.slice(0, 2)}*** ${ultimo.slice(0, 1)}***`;
}

export default function DashboardProfissionalPacientesPage() {
  const [pacientes, setPacientes] = useState<PacienteDashboard[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');

  useEffect(() => {
    const carregar = async () => {
      const [pacientesResponse, triagensResponse] = await Promise.all([
        fetch('/api/pacientes'),
        fetch('/api/triagens?profissionalId=psicologia')
      ]);

      const pacientesData = (await pacientesResponse.json()) as Array<{ id: string; nome: string }>;
      const triagensData = (await triagensResponse.json()) as Array<{
        paciente_id: string;
        nivel_prioridade: string;
        created_at: string;
      }>;

      const merge = pacientesData.map((paciente) => {
        const triagem = triagensData.find((item) => item.paciente_id === paciente.id);
        return {
          id: paciente.id,
          nome: paciente.nome,
          nivel_prioridade: triagem?.nivel_prioridade,
          ultima_triagem: triagem?.created_at
        };
      });

      setPacientes(merge);
    };

    void carregar();
  }, []);

  const filtrados = useMemo(() => {
    return pacientes.filter((paciente) => {
      const porBusca = paciente.nome.toLowerCase().includes(busca.toLowerCase());
      const porPrioridade =
        filtroPrioridade === 'todas' ? true : paciente.nivel_prioridade === filtroPrioridade;

      return porBusca && porPrioridade;
    });
  }, [busca, filtroPrioridade, pacientes]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Pacientes do profissional</h1>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded border p-2"
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar por nome"
          value={busca}
        />

        <select
          className="rounded border p-2"
          onChange={(event) => setFiltroPrioridade(event.target.value)}
          value={filtroPrioridade}
        >
          <option value="todas">Todas as prioridades</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtrados.map((paciente) => (
          <article className="rounded-lg bg-white p-4 shadow" key={paciente.id}>
            <p className="font-semibold">{anonimizarNome(paciente.nome)}</p>
            <p className="text-sm text-slate-600">Prioridade: {paciente.nivel_prioridade ?? 'não definida'}</p>
            <p className="text-sm text-slate-600">
              Última triagem:{' '}
              {paciente.ultima_triagem
                ? new Date(paciente.ultima_triagem).toLocaleString('pt-BR')
                : 'não informada'}
            </p>
            <Link className="mt-2 inline-block text-sm text-blue-700 underline" href={`/pacientes/${paciente.id}`}>
              Ver prontuário completo
            </Link>
          </article>
        ))}

        {!filtrados.length ? <p className="text-sm text-slate-600">Nenhum paciente encontrado.</p> : null}
      </div>
    </section>
  );
}
