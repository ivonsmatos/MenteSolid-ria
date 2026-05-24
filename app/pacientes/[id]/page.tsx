'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { TriagemForm } from '@/components/TriagemForm';
import { Paciente } from '@/types';

export default function PacienteDetalhePage() {
  const params = useParams<{ id: string }>();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPaciente = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/pacientes/${params.id}`);

    if (!response.ok) {
      setPaciente(null);
      setLoading(false);
      return;
    }

    const data = (await response.json()) as Paciente;
    setPaciente(data);
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    void loadPaciente();
  }, [loadPaciente]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!paciente) {
    return <p>Paciente não encontrado.</p>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">{paciente.nome}</h1>
        <p>{paciente.email}</p>
        <p>{paciente.telefone}</p>
        <p>
          {paciente.cidade} - {paciente.estado}
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Triagem inicial (visão profissional/admin)</h2>
        <TriagemForm onSaved={loadPaciente} pacienteId={paciente.id} />
      </div>

      {paciente.triagem ? (
        <div className="rounded bg-white p-4 shadow">
          <h3 className="font-semibold">Resumo de encaminhamento</h3>
          <p className="mt-2 text-sm text-slate-700">
            Perfil indicado: <strong>{paciente.triagem.perfilIndicado}</strong>
          </p>
          <p className="text-sm text-slate-700">Sinal de alerta: {paciente.triagem.sinalDeAlerta ? 'Sim' : 'Não'}</p>
        </div>
      ) : null}
    </section>
  );
}
