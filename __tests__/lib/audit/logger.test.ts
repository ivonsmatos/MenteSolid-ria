import { afterEach, describe, expect, it, vi } from 'vitest';

describe('audit/logger', () => {
  afterEach(() => {
    delete process.env.USE_SUPABASE;
  });

  it('deve propagar erro quando insert no audit_log falha', async () => {
    vi.resetModules();
    process.env.USE_SUPABASE = 'true';

    const { registrarAcesso } = await import('@/lib/audit/logger');
    const { supabaseAdmin } = await import('@/lib/supabase/client');
    const fromMock = vi.mocked(supabaseAdmin.from as unknown as ReturnType<typeof vi.fn>);
    const insert = vi.fn().mockResolvedValue({ error: new Error('falha no insert') });
    fromMock.mockReturnValue({ insert } as unknown as ReturnType<typeof fromMock>);

    await expect(
      registrarAcesso({
        acao: 'update',
        recurso: 'paciente',
        recursoId: '123'
      })
    ).rejects.toThrow('falha no insert');
  });
});
