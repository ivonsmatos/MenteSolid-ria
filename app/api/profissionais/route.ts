import { NextResponse } from 'next/server';
import { AuthError, getSupabaseServer, requirePapel } from '@/lib/supabase/server';

export const runtime = 'edge';

import { profissionalSchema } from '@/lib/validators';
import { profissionalFromRow } from '@/lib/mappers';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  try {
    await requirePapel('profissional', 'admin');
  } catch (e) {
    return authResponse(e);
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('profissionais')
    .select('*')
    .order('criado_em', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    (data ?? []).map((r) => profissionalFromRow(r as Parameters<typeof profissionalFromRow>[0]))
  );
}

export async function POST(request: Request) {
  try {
    await requirePapel('admin');
  } catch (e) {
    return authResponse(e);
  }

  const body = await request.json().catch(() => null);
  const parsed = profissionalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  // Limitação conhecida: inviteUserByEmail não aceita app_metadata, então o role
  // só é setado no updateUserById a seguir. Janela sub-segundo entre os dois.
  // Se o profissional clicar no link de e-mail antes do update, o middleware
  // redireciona para /login e a próxima tentativa funciona.
  const { data: userRes, error: errInvite } = await admin.auth.admin.inviteUserByEmail(
    parsed.data.email
  );

  if (errInvite || !userRes?.user) {
    return NextResponse.json(
      { error: 'Falha ao convidar profissional.', details: errInvite?.message },
      { status: 500 }
    );
  }

  // app_metadata.role precisa ser setado server-side (não pode ser definido pelo usuário no signup).
  const { error: errRole } = await admin.auth.admin.updateUserById(userRes.user.id, {
    app_metadata: { role: 'profissional' }
  });
  if (errRole) {
    return NextResponse.json(
      { error: 'Falha ao definir papel do profissional.', details: errRole.message },
      { status: 500 }
    );
  }

  const { data, error } = await admin
    .from('profissionais')
    .insert({
      user_id: userRes.user.id,
      nome: parsed.data.nome,
      email: parsed.data.email,
      telefone: parsed.data.telefone,
      cidade: parsed.data.cidade,
      uf: parsed.data.uf,
      especialidade: parsed.data.especialidade,
      numero_registro: parsed.data.numeroRegistro,
      ativo: parsed.data.ativo ?? true,
      cal_link: parsed.data.calLink ?? null
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    profissionalFromRow(data as Parameters<typeof profissionalFromRow>[0]),
    { status: 201 }
  );
}

function authResponse(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: 'Erro de autorização.' }, { status: 500 });
}
