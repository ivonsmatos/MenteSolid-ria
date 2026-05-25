'use client';

import { useEffect, useState } from 'react';
import { FilaEncaminhamentos } from '@/components/dashboard/FilaEncaminhamentos';

interface EncaminhamentoItem {
  id: string;
  paciente_id: string;
  resumo_clinico?: string;
  status: string;
}

function resumoCriptografado(resumo?: string): string {
  if (!resumo) {
    return 'Resumo indisponível';
  }

  return btoa(unescape(encodeURIComponent(resumo)));
}

export default function DashboardProfissionalEncaminhamentosPage() {
  const [encaminhamentos, setEncaminhamentos] = useState<EncaminhamentoItem[]>([]);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    const response = await fetch('/api/encaminhamentos?profissionalId=psicologia');
    if (!response.ok) {
      setErro('Não foi possível carregar a fila de encaminhamentos.');
      return;
    }

    const data = (await response.json()) as EncaminhamentoItem[];
    setEncaminhamentos(
      data.map((item) => ({
        ...item,
        resumo_clinico: resumoCriptografado(item.resumo_clinico)
      }))
    );
  };

  useEffect(() => {
    void carregar();
  }, []);

  const atualizarStatus = async (id: string, status: string) => {
    const response = await fetch('/api/encaminhamentos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });

    if (!response.ok) {
      setErro('Falha ao atualizar status.');
      return;
    }

    await carregar();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Fila de encaminhamentos recebidos</h1>
      <p className="text-sm text-slate-600">
        O resumo clínico é exibido em formato protegido para evitar exposição indevida de dados sensíveis.
      </p>

      {erro ? <p className="text-sm text-red-700">{erro}</p> : null}

      <FilaEncaminhamentos encaminhamentos={encaminhamentos} onAtualizarStatus={atualizarStatus} />
    </section>
  );
}
