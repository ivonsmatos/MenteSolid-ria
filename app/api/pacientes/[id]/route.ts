import { NextResponse } from 'next/server';
import { getPacienteById, updatePacienteTriagem } from '@/lib/db';
import { comAudit } from '@/lib/audit/middleware';
import { USE_SUPABASE } from '@/lib/env';
import { respostaErro } from '@/lib/http/json';
import { buscarPaciente } from '@/lib/supabase/pacientes';
import { criarTriagem } from '@/lib/supabase/triagens';
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
    const profissionalId: string = (body as { profissional_id?: string }).profissional_id ?? '';
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

    const triagem = await criarTriagem({
      paciente_id: id,
      profissional_id: profissionalId,
      nivel_prioridade: parsed.data.perfilIndicado,
      alerta_cvv: parsed.data.sinalDeAlerta,
      sintomas: parsed.data.sintomasRelatados,
      observacoes: parsed.data.resumoClinicoParaEspecialista
    });

    return NextResponse.json(triagem);
  } catch {
    return respostaErro(500, 'Falha ao atualizar paciente.');
  }
}

export const GET = comAudit(getPacienteHandler, 'VISUALIZAR_PRONTUARIO', 'paciente');
export const PATCH = comAudit(patchPacienteHandler, 'ATUALIZAR_PRONTUARIO', 'paciente');
