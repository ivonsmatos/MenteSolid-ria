import { calcomRequest } from '@/lib/calcom/client';

const mapaProfissionalEventType: Record<string, number> = {
  psicologia: 1,
  psiquiatria: 2
};

interface DadosAgendamento {
  profissionalId: string;
  email: string;
  nome: string;
  inicio: string;
}

function resolverEventTypeId(profissionalId: string): number {
  return mapaProfissionalEventType[profissionalId] ?? 1;
}

export async function buscarDisponibilidade(
  profissionalId: string,
  dataInicio: string,
  dataFim: string
): Promise<unknown[]> {
  const eventTypeId = resolverEventTypeId(profissionalId);
  const payload = await calcomRequest('/slots', {
    method: 'GET',
    query: {
      eventTypeId,
      startTime: dataInicio,
      endTime: dataFim
    }
  });

  return (payload?.data as unknown[]) ?? [];
}

export async function criarAgendamento(dados: DadosAgendamento): Promise<unknown> {
  const eventTypeId = resolverEventTypeId(dados.profissionalId);

  const payload = await calcomRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify({
      eventTypeId,
      start: dados.inicio,
      responses: {
        name: dados.nome,
        email: dados.email
      }
    })
  });

  return payload?.data;
}

export async function cancelarAgendamento(bookingId: string): Promise<unknown> {
  const payload = await calcomRequest(`/bookings/${bookingId}/cancel`, {
    method: 'POST'
  });

  return payload?.data;
}
