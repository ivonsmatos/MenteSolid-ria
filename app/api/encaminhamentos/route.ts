import { NextResponse } from 'next/server';
import {
  createEncaminhamentoDb,
  listEncaminhamentosByDestinoDb,
  updateEncaminhamentoStatusDb
} from '@/lib/db';
import { USE_SUPABASE } from '@/lib/env';
import { respostaErro } from '@/lib/http/json';
import {
  atualizarStatus,
  criarEncaminhamento,
  listarEncaminhamentos
} from '@/lib/supabase/encaminhamentos';

interface EncaminhamentoPayload {
  paciente_id: string;
  profissional_origem_id?: string;
  profissional_destino_id?: string;
  resumo_clinico?: string;
  status?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalId = searchParams.get('profissionalId');

    if (!profissionalId) {
      return respostaErro(400, 'profissionalId é obrigatório.');
    }

    if (!USE_SUPABASE) {
      const encaminhamentos = await listEncaminhamentosByDestinoDb(profissionalId);
      return NextResponse.json(encaminhamentos);
    }

    const encaminhamentos = await listarEncaminhamentos(profissionalId);
    return NextResponse.json(encaminhamentos);
  } catch {
    return respostaErro(500, 'Falha ao listar encaminhamentos.');
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EncaminhamentoPayload;

    if (!body.paciente_id) {
      return respostaErro(400, 'paciente_id é obrigatório.');
    }

    if (!USE_SUPABASE) {
      const encaminhamento = await createEncaminhamentoDb(body);
      return NextResponse.json(encaminhamento, { status: 201 });
    }

    const encaminhamento = await criarEncaminhamento(body);
    return NextResponse.json(encaminhamento, { status: 201 });
  } catch {
    return respostaErro(500, 'Falha ao criar encaminhamento.');
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; status?: string };
    if (!body.id || !body.status) {
      return respostaErro(400, 'Campos obrigatórios: id e status.');
    }

    if (!USE_SUPABASE) {
      const encaminhamento = await updateEncaminhamentoStatusDb(body.id, body.status);
      if (!encaminhamento) {
        return respostaErro(404, 'Encaminhamento não encontrado.');
      }

      return NextResponse.json(encaminhamento);
    }

    const encaminhamento = await atualizarStatus(body.id, body.status);
    if (!encaminhamento) {
      return respostaErro(404, 'Encaminhamento não encontrado.');
    }

    return NextResponse.json(encaminhamento);
  } catch {
    return respostaErro(500, 'Falha ao atualizar encaminhamento.');
  }
}
