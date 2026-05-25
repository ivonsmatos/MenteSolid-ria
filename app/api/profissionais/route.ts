import { NextResponse } from 'next/server';
import { createProfissional, getProfissionais } from '@/lib/db';
import { USE_SUPABASE } from '@/lib/env';
import { respostaErro } from '@/lib/http/json';
import { criarProfissional, listarProfissionais } from '@/lib/supabase/profissionais';
import { profissionalSchema } from '@/lib/validators';

export async function GET() {
  try {
    if (!USE_SUPABASE) {
      const profissionais = await getProfissionais();
      return NextResponse.json(profissionais);
    }

    const profissionais = await listarProfissionais();
    return NextResponse.json(profissionais);
  } catch {
    return respostaErro(500, 'Falha ao listar profissionais.');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = profissionalSchema.safeParse(body);

    if (!parsed.success) {
      return respostaErro(400, 'Dados inválidos.', parsed.error.flatten().fieldErrors);
    }

    if (!USE_SUPABASE) {
      const profissional = await createProfissional(parsed.data);
      return NextResponse.json(profissional, { status: 201 });
    }

    const profissional = await criarProfissional({
      nome: parsed.data.nome,
      crp_crm: parsed.data.numeroRegistro,
      especialidade: parsed.data.especialidade,
      email: parsed.data.email,
      disponivel: parsed.data.ativo ?? true
    });

    return NextResponse.json(profissional, { status: 201 });
  } catch {
    return respostaErro(500, 'Falha ao criar profissional.');
  }
}
