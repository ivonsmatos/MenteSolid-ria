import { NextResponse } from 'next/server';
import { isStripeConfigured, validarWebhook } from '@/lib/stripe';
import { captureError, logInfo } from '@/lib/observability';

// Webhook é PÚBLICO mas valida assinatura via Stripe. NÃO requer auth Supabase.
// Adicione `/api/stripe/webhook` à lista API_PUBLICAS do middleware (já está).

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe não configurado.', code: 'STRIPE_NOT_CONFIGURED' },
      { status: 503 }
    );
  }

  const sig = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  let event;
  try {
    event = validarWebhook(rawBody, sig);
  } catch (e) {
    captureError(e, { rota: '/api/stripe/webhook', motivo: 'assinatura' });
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 400 });
  }

  logInfo('stripe.webhook.recebido', { tipo: event.type, id: event.id });

  // TODO: tratar eventos relevantes (checkout.session.completed,
  // customer.subscription.updated, customer.subscription.deleted) atualizando
  // public.assinaturas_profissionais via Supabase admin.

  return NextResponse.json({ recebido: true });
}
