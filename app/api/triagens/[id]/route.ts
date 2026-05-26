import { NextResponse } from 'next/server';
import {
  AuthError,
  getPapel,
  getSessionUser,
  getSupabaseServer,
  requirePapel
} from '@/lib/supabase/server';

export const runtime = 'edge';

import { atualizarTriagemSchema } from '@/lib/validators';

type RouteParams = { params: Promise<{ id: string }> };

function authResponse(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: 'Erro de autorização.' }, { status: 500 });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await requirePapel('profissional', 'admin');
  } catch (e) {
    return authResponse(e);
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = atualizarTriagemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Payload inválido.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await getSupabaseServer();
  const papel = await getPapel();
  const user = await getSessionUser();

  let profissionalId: string | null = null;
  if (parsed.data.claim) {
    if (papel === 'admin') {
      return NextResponse.json(
        { error: 'Admins não podem assumir casos. Reatribua manualmente.' },
        { status: 400 }
      );
    }
    const { data: prof } = await supabase
      .from('profissionais')
      .select('id, ativo')
      .eq('user_id', user!.id)
      .maybeSingle();
    if (!prof) {
      return NextResponse.json(
        { error: 'Você ainda não tem perfil de profissional vinculado.' },
        { status: 403 }
      );
    }
    if (!(prof as { ativo: boolean }).ativo) {
      return NextResponse.json(
        { error: 'Seu perfil de profissional está inativo.' },
        { status: 403 }
      );
    }
    profissionalId = (prof as { id: string }).id;

    const { data: existente } = await supabase
      .from('triagens')
      .select('profissional_id')
      .eq('id', id)
      .maybeSingle();
    if (!existente) {
      return NextResponse.json({ error: 'Triagem não encontrada.' }, { status: 404 });
    }
    const ja = (existente as { profissional_id: string | null }).profissional_id;
    if (ja && ja !== profissionalId) {
      return NextResponse.json(
        { error: 'Este caso já foi assumido por outro profissional.' },
        { status: 409 }
      );
    }
  }

  const update: Record<string, unknown> = {};
  if (profissionalId) update.profissional_id = profissionalId;
  if (parsed.data.status) update.status = parsed.data.status;

  const { error } = await supabase.from('triagens').update(update).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
