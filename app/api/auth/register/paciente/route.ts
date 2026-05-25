import { NextResponse } from 'next/server';
import { createPaciente } from '@/lib/db';
import { USE_SUPABASE } from '@/lib/env';
import { respostaErro } from '@/lib/http/json';
import { registrarConsentimento } from '@/lib/lgpd/consentimento';
import { supabaseAdmin } from '@/lib/supabase/client';
import { pacienteSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const senha = typeof body.senha === 'string' ? body.senha : '';
    const aceitouLgpd = body.aceitouLgpd === true;
    const parsed = pacienteSchema.safeParse(body);

    if (!parsed.success || senha.length < 6 || !aceitouLgpd) {
      return respostaErro(400, 'Dados de cadastro inválidos ou consentimento ausente.', {
        campos: parsed.success ? undefined : parsed.error.flatten().fieldErrors
      });
    }

    if (!USE_SUPABASE) {
      const paciente = await createPaciente(parsed.data);
      return NextResponse.json(paciente, { status: 201 });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: parsed.data.email,
      password: senha,
      email_confirm: true,
      user_metadata: {
        nome: parsed.data.nome,
        perfil: 'paciente'
      }
    });

    if (authError) {
      return respostaErro(400, 'Falha ao criar usuário de autenticação.');
    }

    const { data, error } = await supabaseAdmin
      .from('pacientes')
      .insert({
        id: authData.user.id,
        nome: parsed.data.nome,
        email: parsed.data.email,
        telefone: parsed.data.telefone,
        data_nascimento: parsed.data.dataNascimento,
        genero: parsed.data.genero
      } as Record<string, unknown>)
      .select('*')
      .single();

    if (error || !data) {
      return respostaErro(400, 'Falha ao registrar paciente.');
    }

    const ip = request.headers.get('x-forwarded-for') ?? '0.0.0.0';
    await registrarConsentimento(data.id as string, ip);

    return NextResponse.json(data, { status: 201 });
  } catch {
    return respostaErro(500, 'Erro inesperado ao cadastrar paciente.');
  }
}
