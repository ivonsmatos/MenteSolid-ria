import { NextResponse } from 'next/server';
import {
  AuthError,
  getSessionUser,
  getSupabaseServer,
  requirePapel
} from '@/lib/supabase/server';

export const runtime = 'edge';

import { isStripeConfigured, criarCheckoutSession } from '@/lib/stripe';
import { captureError } from '@/lib/observability';

function authResponse(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: 'Erro de autorização.' }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    await requirePapel('profissional');
  } catch (e) {
    return authResponse(e);
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Pagamentos ainda não configurados.', code: 'STRIPE_NOT_CONFIGURED' },
      { status: 503 }
    );
  }

  const user = await getSessionUser();
  const supabase = await getSupabaseServer();
  const { data: prof } = await supabase
    .from('profissionais')
    .select('id, email')
    .eq('user_id', user!.id)
    .maybeSingle();

  if (!prof) {
    return NextResponse.json(
      { error: 'Perfil de profissional não encontrado.' },
      { status: 404 }
    );
  }

  const base = new URL(request.url).origin;
  try {
    const session = await criarCheckoutSession({
      profissionalId: (prof as { id: string }).id,
      email: (prof as { email: string }).email,
      successUrl: `${base}/painel/assinatura?ok=1`,
      cancelUrl: `${base}/painel/assinatura?cancelado=1`
    });
    return NextResponse.json(session);
  } catch (e) {
    captureError(e, { rota: '/api/stripe/checkout' });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha ao iniciar checkout.' },
      { status: 500 }
    );
  }
}
