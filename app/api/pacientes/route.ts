import { NextResponse } from 'next/server';
import { createPaciente, getPacientes } from '@/lib/db';
import { USE_SUPABASE } from '@/lib/env';
import { respostaErro } from '@/lib/http/json';
import { criarPaciente, listarPacientes } from '@/lib/supabase/pacientes';
import { pacienteSchema } from '@/lib/validators';

export async function GET(request: Request) {
  try {
    if (!USE_SUPABASE) {
      const pacientes = await getPacientes();
      return NextResponse.json(pacientes);
    }

    const { searchParams } = new URL(request.url);
    const profissionalId = searchParams.get('profissionalId') ?? undefined;
    const page = Number(searchParams.get('page') ?? '1');
    const perPage = Number(searchParams.get('perPage') ?? '10');

    const pacientes = await listarPacientes({
      profissionalId,
      page: Number.isNaN(page) ? 1 : page,
      perPage: Number.isNaN(perPage) ? 10 : perPage
    });

    return NextResponse.json(pacientes);
  } catch {
    return respostaErro(500, 'Falha ao listar pacientes.');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = pacienteSchema.safeParse(body);

    if (!parsed.success) {
      return respostaErro(400, 'Dados inválidos.', parsed.error.flatten().fieldErrors);
    }

    const pacientesExistentes = await getPacientes();
    const emailExists = pacientesExistentes.some(
      (paciente) => paciente.email.toLowerCase() === parsed.data.email.toLowerCase()
    );

    if (emailExists && !USE_SUPABASE) {
      return respostaErro(409, 'E-mail já cadastrado para outro paciente.');
    }

    if (!USE_SUPABASE) {
      const novoPaciente = await createPaciente(parsed.data);
      return NextResponse.json(novoPaciente, { status: 201 });
    }

    const novoPaciente = await criarPaciente({
      nome: parsed.data.nome,
      email: parsed.data.email,
      telefone: parsed.data.telefone,
      data_nascimento: parsed.data.dataNascimento,
      genero: parsed.data.genero,
      vulnerabilidade_socioeconomica: undefined
    });

    return NextResponse.json(novoPaciente, { status: 201 });
  } catch {
    return respostaErro(500, 'Falha ao criar paciente.');
  }
}
