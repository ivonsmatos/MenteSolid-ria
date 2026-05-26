import { NextResponse } from 'next/server';
import { AuthError, getSupabaseServer, requirePapel } from '@/lib/supabase/server';
import { triagemSchema } from '@/lib/validators';
import { pacienteFromRow, triagemFromRow } from '@/lib/mappers';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteParams) {
  try {
    await requirePapel('profissional', 'admin');
  } catch (e) {
    return authResponse(e);
  }

  const { id } = await params;
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('pacientes')
    .select('*, triagens(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });

  const triagensArr = (data as { triagens?: unknown[] | null }).triagens ?? [];
  const ultima = Array.isArray(triagensArr) && triagensArr.length
    ? triagemFromRow(triagensArr[0] as Parameters<typeof triagemFromRow>[0])
    : null;

  return NextResponse.json(
    pacienteFromRow(data as Parameters<typeof pacienteFromRow>[0], ultima as never)
  );
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await requirePapel('profissional', 'admin');
  } catch (e) {
    return authResponse(e);
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = triagemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados de triagem inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await getSupabaseServer();

  const { data: paciente } = await supabase
    .from('pacientes')
    .select('id')
    .eq('id', id)
    .maybeSingle();
  if (!paciente) {
    return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });
  }

  const { data: existente } = await supabase
    .from('triagens')
    .select('id')
    .eq('paciente_id', id)
    .order('criado_em', { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    paciente_id: id,
    motivo_da_busca: parsed.data.motivoDaBusca,
    sintomas_relatados: parsed.data.sintomasRelatados,
    tempo_de_queixa: parsed.data.tempoDeQueixa,
    impacto_na_rotina: parsed.data.impactoNaRotina,
    perfil_indicado: parsed.data.perfilIndicado,
    sinal_de_alerta: parsed.data.sinalDeAlerta,
    resumo_clinico: parsed.data.resumoClinicoParaEspecialista
  };

  if (existente) {
    const { error } = await supabase.from('triagens').update(payload).eq('id', existente.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase.from('triagens').insert(payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function authResponse(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: 'Erro de autorização.' }, { status: 500 });
}
