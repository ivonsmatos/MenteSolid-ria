import {
  buscarDisponibilidade,
  cancelarAgendamento,
  criarAgendamento
} from '@/lib/calcom/agendamento';
import { respostaErro } from '@/lib/http/json';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalId = searchParams.get('profissionalId');
    const data = searchParams.get('data');

    if (!profissionalId || !data) {
      return respostaErro(400, 'Parâmetros obrigatórios: profissionalId e data.');
    }

    const inicio = new Date(`${data}T00:00:00.000Z`).toISOString();
    const fim = new Date(`${data}T23:59:59.999Z`).toISOString();

    const slots = await buscarDisponibilidade(profissionalId, inicio, fim);
    return Response.json(slots);
  } catch {
    return respostaErro(500, 'Falha ao buscar disponibilidade.');
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      profissionalId?: string;
      nome?: string;
      email?: string;
      inicio?: string;
    };

    if (!body.profissionalId || !body.nome || !body.email || !body.inicio) {
      return respostaErro(400, 'Campos obrigatórios: profissionalId, nome, email, inicio.');
    }

    const booking = await criarAgendamento({
      profissionalId: body.profissionalId,
      nome: body.nome,
      email: body.email,
      inicio: body.inicio
    });

    return Response.json(booking, { status: 201 });
  } catch {
    return respostaErro(500, 'Falha ao criar agendamento.');
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return respostaErro(400, 'Parâmetro bookingId é obrigatório.');
    }

    const cancelamento = await cancelarAgendamento(bookingId);
    return Response.json(cancelamento);
  } catch {
    return respostaErro(500, 'Falha ao cancelar agendamento.');
  }
}
