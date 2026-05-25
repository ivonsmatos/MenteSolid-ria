'use client';

import { useEffect, useState } from 'react';

interface AcessoItem {
  id?: string;
  created_at?: string;
  acao: string;
  user_id?: string;
}

interface HistoricoAcessosProps {
  recurso: string;
  recursoId: string;
}

function anonimizarProfissional(userId?: string): string {
  if (!userId) {
    return 'Profissional não identificado';
  }

  return `${userId.slice(0, 4)}***`;
}

export function HistoricoAcessos({ recurso, recursoId }: HistoricoAcessosProps) {
  const [acessos, setAcessos] = useState<AcessoItem[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      const response = await fetch(
        `/api/audit?recursoId=${encodeURIComponent(recursoId)}&recurso=${encodeURIComponent(recurso)}`
      );

      if (!response.ok) {
        setErro('Não foi possível carregar o histórico de acessos.');
        return;
      }

      const data = (await response.json()) as AcessoItem[];
      setAcessos(data);
    };

    void carregar();
  }, [recurso, recursoId]);

  return (
    <section className="space-y-3 rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Histórico de acessos</h2>

      {erro ? <p className="text-sm text-red-700">{erro}</p> : null}

      <ul className="space-y-2 text-sm">
        {acessos.map((acesso, index) => (
          <li className="rounded border p-2" key={acesso.id ?? index}>
            <p>
              {acesso.created_at
                ? new Date(acesso.created_at).toLocaleString('pt-BR')
                : 'Data não informada'}
            </p>
            <p>Profissional: {anonimizarProfissional(acesso.user_id)}</p>
            <p>Ação: {acesso.acao}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
