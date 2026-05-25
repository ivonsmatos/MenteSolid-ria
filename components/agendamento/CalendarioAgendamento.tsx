'use client';

import { useState } from 'react';

interface Slot {
  time?: string;
  start?: string;
}

interface CalendarioAgendamentoProps {
  profissionalId: string;
  nomePaciente: string;
  emailPaciente: string;
}

export function CalendarioAgendamento({
  profissionalId,
  nomePaciente,
  emailPaciente
}: CalendarioAgendamentoProps) {
  const [data, setData] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState('');

  const carregarSlots = async () => {
    if (!data) {
      return;
    }

    setStatus('Carregando disponibilidade...');
    const response = await fetch(
      `/api/agendamento?profissionalId=${encodeURIComponent(profissionalId)}&data=${encodeURIComponent(data)}`
    );

    if (!response.ok) {
      setStatus('Falha ao carregar horários.');
      return;
    }

    const payload = (await response.json()) as Slot[];
    setSlots(payload);
    setStatus(payload.length ? 'Selecione um horário abaixo.' : 'Sem horários disponíveis para essa data.');
  };

  const agendar = async (inicio: string) => {
    setStatus('Confirmando agendamento...');
    const response = await fetch('/api/agendamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profissionalId,
        nome: nomePaciente,
        email: emailPaciente,
        inicio
      })
    });

    setStatus(response.ok ? 'Agendamento confirmado com sucesso.' : 'Não foi possível concluir o agendamento.');
  };

  return (
    <section className="space-y-3 rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Agendamento</h2>

      <div className="flex gap-2">
        <input className="rounded border p-2" onChange={(event) => setData(event.target.value)} type="date" value={data} />
        <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={carregarSlots} type="button">
          Buscar horários
        </button>
      </div>

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}

      <ul className="space-y-2">
        {slots.map((slot) => {
          const valor = slot.start ?? slot.time;
          if (!valor) {
            return null;
          }

          return (
            <li className="flex items-center justify-between rounded border p-2" key={valor}>
              <span className="text-sm">{new Date(valor).toLocaleString('pt-BR')}</span>
              <button className="rounded bg-emerald-600 px-3 py-1 text-sm text-white" onClick={() => agendar(valor)} type="button">
                Confirmar
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
