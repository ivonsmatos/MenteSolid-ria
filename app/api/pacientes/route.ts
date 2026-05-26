import { NextResponse } from 'next/server';
import { AuthError, getSupabaseServer, requirePapel } from '@/lib/supabase/server';
import { pacienteSchema } from '@/lib/validators';
import { pacienteFromRow } from '@/lib/mappers';

export async function GET() {
  try {
    await requirePapel('profissional', 'admin');
  } catch (e) {
    return authResponse(e);
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .order('criado_em', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((r) => pacienteFromRow(r as Parameters<typeof pacienteFromRow>[0]))
  );
}

export async function POST(request: Request) {
  try {
    await requirePapel('profissional', 'admin');
  } catch (e) {
    return authResponse(e);
  }

  const body = await request.json().catch(() => null);
  const parsed = pacienteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
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
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    pacienteFromRow(data as Parameters<typeof pacienteFromRow>[0]),
    { status: 201 }
  );
}

function authResponse(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: 'Erro de autorização.' }, { status: 500 });
}
