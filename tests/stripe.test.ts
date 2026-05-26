import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isStripeConfigured, criarCheckoutSession } from '@/lib/stripe';

const VARS = ['STRIPE_SECRET_KEY', 'STRIPE_PRICE_ID', 'STRIPE_WEBHOOK_SECRET'];

describe('stripe — modo não configurado', () => {
  const snapshot: Record<string, string | undefined> = {};

  beforeEach(() => {
    VARS.forEach((k) => {
      snapshot[k] = process.env[k];
      delete process.env[k];
    });
  });

  afterEach(() => {
    VARS.forEach((k) => {
      if (snapshot[k] === undefined) delete process.env[k];
      else process.env[k] = snapshot[k]!;
    });
  });

  it('isStripeConfigured false sem env vars', () => {
    expect(isStripeConfigured()).toBe(false);
  });

  it('criarCheckoutSession joga STRIPE_NOT_CONFIGURED', async () => {
    await expect(
      criarCheckoutSession({
        profissionalId: 'p1',
        email: 'j@x.com',
        successUrl: 'http://x/ok',
        cancelUrl: 'http://x/no'
      })
    ).rejects.toThrow('STRIPE_NOT_CONFIGURED');
  });

  it('isStripeConfigured true quando ambas as vars existem', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_x';
    process.env.STRIPE_PRICE_ID = 'price_x';
    expect(isStripeConfigured()).toBe(true);
  });
});
