import { NextResponse } from 'next/server';
import { createTriagemDb, getTriagemByIdDb, listTriagensByProfissionalDb } from '@/lib/db';
import { USE_SUPABASE } from '@/lib/env';
import { respostaErro } from '@/lib/http/json';
import { buscarTriagem, criarTriagem, listarTriagens } from '@/lib/supabase/triagens';

interface TriagemPayload {
  paciente_id: string;
  profissional_id: string;
  nivel_prioridade: string;
  alerta_cvv?: boolean;
  sintomas?: string[];
  observacoes?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const profissionalId = searchParams.get('profissionalId');

    if (!id && !profissionalId) {
      return respostaErro(400, 'Informe id ou profissionalId.');
    }

    if (id) {
      if (!USE_SUPABASE) {
        const triagem = await getTriagemByIdDb(id);
        if (!triagem) {
          return respostaErro(404, 'Triagem não encontrada.');
        }

        return NextResponse.json(triagem);
      }

      const triagem = await buscarTriagem(id);
      if (!triagem) {
        return respostaErro(404, 'Triagem não encontrada.');
      }

      return NextResponse.json(triagem);
    }

    if (!profissionalId) {
      return respostaErro(400, 'profissionalId é obrigatório.');
    }

    if (!USE_SUPABASE) {
      const triagens = await listTriagensByProfissionalDb(profissionalId);
      return NextResponse.json(triagens);
    }

    const triagens = await listarTriagens(profissionalId);
    return NextResponse.json(triagens);
  } catch {
    return respostaErro(500, 'Falha ao listar triagens.');
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TriagemPayload;

    if (!body.paciente_id || !body.profissional_id || !body.nivel_prioridade) {
      return respostaErro(400, 'Campos obrigatórios: paciente_id, profissional_id, nivel_prioridade.');
    }

    if (!USE_SUPABASE) {
      const triagem = await createTriagemDb({
        paciente_id: body.paciente_id,
        profissional_id: body.profissional_id,
        nivel_prioridade: body.nivel_prioridade,
        alerta_cvv: body.alerta_cvv ?? false,
        sintomas: body.sintomas ?? [],
        observacoes: body.observacoes
      });

      return NextResponse.json(triagem, { status: 201 });
    }

    const triagem = await criarTriagem(body);
    return NextResponse.json(triagem, { status: 201 });
  } catch {
    return respostaErro(500, 'Falha ao criar triagem.');
  }
}
