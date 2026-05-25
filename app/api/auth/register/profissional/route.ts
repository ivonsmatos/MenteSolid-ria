import { NextResponse } from 'next/server';
import { createProfissional } from '@/lib/db';
import { USE_SUPABASE } from '@/lib/env';
import { respostaErro } from '@/lib/http/json';
import { supabaseAdmin } from '@/lib/supabase/client';
import { profissionalSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const senha = typeof body.senha === 'string' ? body.senha : '';
    const parsed = profissionalSchema.safeParse(body);

    if (!parsed.success || senha.length < 6) {
      return respostaErro(400, 'Dados de cadastro inválidos.', {
        campos: parsed.success ? undefined : parsed.error.flatten().fieldErrors
      });
    }

    if (!USE_SUPABASE) {
      const profissional = await createProfissional(parsed.data);
      return NextResponse.json(profissional, { status: 201 });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: parsed.data.email,
      password: senha,
      email_confirm: true,
      user_metadata: {
        nome: parsed.data.nome,
        perfil: 'profissional'
      }
    });

    if (authError) {
      return respostaErro(400, 'Falha ao criar usuário de autenticação.');
    }

    const { data, error } = await supabaseAdmin
      .from('profissionais')
      .insert({
        id: authData.user.id,
        nome: parsed.data.nome,
        crp_crm: parsed.data.numeroRegistro,
        especialidade: parsed.data.especialidade,
        email: parsed.data.email,
        disponivel: parsed.data.ativo ?? true
      } as Record<string, unknown>)
      .select('*')
      .single();

    if (error) {
      return respostaErro(400, 'Falha ao registrar profissional.');
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return respostaErro(500, 'Erro inesperado ao cadastrar profissional.');
  }
}
