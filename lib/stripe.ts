import 'server-only';

// Lazy-init guarda contra ausência de credenciais. Rotas devem checar
// isStripeConfigured() antes de chamar e devolver 503 quando não estiver.

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}

export interface CheckoutSessionInput {
  profissionalId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  url: string;
  id: string;
}

// Stub: cria checkout session. Hoje retorna erro estruturado quando não há
// credenciais; quando o usuário configurar STRIPE_SECRET_KEY + STRIPE_PRICE_ID,
// trocar este corpo pela chamada real ao SDK `stripe` (npm install stripe).
export async function criarCheckoutSession(_input: CheckoutSessionInput): Promise<CheckoutSessionResult> {
  if (!isStripeConfigured()) {
    throw new Error('STRIPE_NOT_CONFIGURED');
  }
  throw new Error(
    'Stripe SDK ainda não instalado. Instale `npm i stripe` e troque este stub.'
  );
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}

// Stub de validação de webhook. Quando o SDK estiver instalado, usar
// `stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)`.
export function validarWebhook(_rawBody: string, _signature: string | null): StripeWebhookEvent {
  if (!isStripeConfigured()) {
    throw new Error('STRIPE_NOT_CONFIGURED');
  }
  throw new Error('Validação real exige `stripe` SDK.');
}
