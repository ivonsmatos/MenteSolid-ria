import { NextResponse } from 'next/server';
import { getPacienteById, updatePacienteTriagem } from '@/lib/db';
import { comAudit } from '@/lib/audit/middleware';
import { USE_SUPABASE } from '@/lib/env';
import { respostaErro } from '@/lib/http/json';
import { atualizarPaciente, buscarPaciente } from '@/lib/supabase/pacientes';
import { triagemSchema } from '@/lib/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

async function getPacienteHandler(_: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!USE_SUPABASE) {
      const paciente = await getPacienteById(id);

      if (!paciente) {
        return respostaErro(404, 'Paciente não encontrado.');
      }

      return NextResponse.json(paciente);
    }

    const paciente = await buscarPaciente(id);
    if (!paciente) {
      return respostaErro(404, 'Paciente não encontrado.');
    }

    return NextResponse.json(paciente);
  } catch {
    return respostaErro(500, 'Falha ao buscar paciente.');
  }
}

async function patchPacienteHandler(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = triagemSchema.safeParse(body);

    if (!parsed.success) {
      return respostaErro(400, 'Dados de triagem inválidos.', parsed.error.flatten().fieldErrors);
    }

    if (!USE_SUPABASE) {
      const updated = await updatePacienteTriagem(id, parsed.data);

      if (!updated) {
        return respostaErro(404, 'Paciente não encontrado.');
      }

      return NextResponse.json(updated);
    }

    const updated = await atualizarPaciente(id, {
      vulnerabilidade_socioeconomica: parsed.data.sinalDeAlerta
    });

    if (!updated) {
      return respostaErro(404, 'Paciente não encontrado.');
    }

    return NextResponse.json(updated);
  } catch {
    return respostaErro(500, 'Falha ao atualizar paciente.');
  }
}

export const GET = comAudit(getPacienteHandler, 'VISUALIZAR_PRONTUARIO', 'paciente');
export const PATCH = comAudit(patchPacienteHandler, 'ATUALIZAR_PRONTUARIO', 'paciente');
