import { NextResponse } from 'next/server';
import { pacientePublicoCadastroSchema } from '@/lib/validators';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { TERMO_LGPD_VERSAO } from '@/lib/lgpd';

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = pacientePublicoCadastroSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: existente } = await supabase
    .from('pacientes')
    .select('id')
    .eq('email', parsed.data.email)
    .maybeSingle();

  if (existente) {
    return NextResponse.json(
      { error: 'E-mail já cadastrado.' },
      { status: 409 }
    );
  }

  const { data: paciente, error: errPaciente } = await supabase
    .from('pacientes')
    .insert({
      nome: parsed.data.nome,
      email: parsed.data.email,
      telefone: parsed.data.telefone,
      cidade: parsed.data.cidade,
      uf: parsed.data.uf,
      data_nascimento: parsed.data.dataNascimento ?? null,
      genero: parsed.data.genero ?? null,
      como_chegou: parsed.data.comoChegou ?? null
    })
    .select('id')
    .single();

  if (errPaciente || !paciente) {
    if (errPaciente && (errPaciente as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Falha ao registrar paciente.', details: errPaciente?.message },
      { status: 500 }
    );
  }

  const { error: errConsentimento } = await supabase.from('consentimentos_lgpd').insert({
    paciente_id: paciente.id,
    versao_termo: TERMO_LGPD_VERSAO,
    ip: getClientIp(request),
    user_agent: request.headers.get('user-agent')
  });

  if (errConsentimento) {
    await supabase.from('pacientes').delete().eq('id', paciente.id);
    return NextResponse.json(
      { error: 'Falha ao registrar consentimento LGPD.', details: errConsentimento.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: paciente.id }, { status: 201 });
}
