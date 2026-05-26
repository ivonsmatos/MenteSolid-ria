import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { TERMO_LGPD_VERSAO } from '@/lib/lgpd';
import { pacientePublicoCadastroSchema, triagemSchema } from '@/lib/validators';

const concluirSchema = z.object({
  paciente: pacientePublicoCadastroSchema,
  triagem: triagemSchema
});

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = concluirSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { paciente, triagem } = parsed.data;

  const { data: existente } = await supabase
    .from('pacientes')
    .select('id')
    .eq('email', paciente.email)
    .maybeSingle();

  if (existente) {
    return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
  }

  const { data: novoPaciente, error: errPaciente } = await supabase
    .from('pacientes')
    .insert({
      nome: paciente.nome,
      email: paciente.email,
      telefone: paciente.telefone,
      cidade: paciente.cidade,
      uf: paciente.uf,
      data_nascimento: paciente.dataNascimento ?? null,
      genero: paciente.genero ?? null,
      como_chegou: paciente.comoChegou ?? 'acolhimento por IA'
    })
    .select('id')
    .single();

  if (errPaciente || !novoPaciente) {
    if (errPaciente && (errPaciente as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Falha ao registrar paciente.', details: errPaciente?.message },
      { status: 500 }
    );
  }

  const { error: errConsentimento } = await supabase.from('consentimentos_lgpd').insert({
    paciente_id: novoPaciente.id,
    versao_termo: TERMO_LGPD_VERSAO,
    ip: getClientIp(request),
    user_agent: request.headers.get('user-agent')
  });

  if (errConsentimento) {
    await supabase.from('pacientes').delete().eq('id', novoPaciente.id);
    return NextResponse.json(
      { error: 'Falha ao registrar consentimento LGPD.', details: errConsentimento.message },
      { status: 500 }
    );
  }

  const { error: errTriagem } = await supabase.from('triagens').insert({
    paciente_id: novoPaciente.id,
    motivo_da_busca: triagem.motivoDaBusca,
    sintomas_relatados: triagem.sintomasRelatados,
    tempo_de_queixa: triagem.tempoDeQueixa,
    impacto_na_rotina: triagem.impactoNaRotina,
    perfil_indicado: triagem.perfilIndicado,
    sinal_de_alerta: triagem.sinalDeAlerta,
    resumo_clinico: triagem.resumoClinicoParaEspecialista
  });

  if (errTriagem) {
    return NextResponse.json(
      { error: 'Falha ao registrar triagem (paciente já criado).', details: errTriagem.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: novoPaciente.id, prioritario: triagem.sinalDeAlerta }, { status: 201 });
}
