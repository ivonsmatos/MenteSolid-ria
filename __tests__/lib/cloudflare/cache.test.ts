import { describe, expect, it } from 'vitest';
import { cacheGet, cachePut } from '@/lib/cloudflare/cache';

describe('cloudflare/cache', () => {
  it('deve salvar e recuperar valor no cache local quando KV não estiver configurado', async () => {
    const chave = `calcom:slots:${Date.now()}`;
    const payload = { slots: ['2026-05-25T10:00:00.000Z'] };

    await cachePut(chave, payload, 60);
    const resultado = await cacheGet<typeof payload>(chave);

    expect(resultado).toEqual(payload);
  });

  it('deve bloquear cache de chave ou payload sensível', async () => {
    await expect(cachePut('paciente:123', { ok: true }, 60)).rejects.toThrow(
      /sensível/i
    );
    await expect(cachePut('groq:publico:ok', { email: 'teste@teste.com' }, 60)).rejects.toThrow(
      /sensível/i
    );
  });
});
