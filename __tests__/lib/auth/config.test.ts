import { describe, expect, it } from 'vitest';
import { authOptions } from '@/lib/auth/config';

describe('auth/config', () => {
  it('deve persistir o access token do Supabase no callback jwt', async () => {
    const jwtCallback = authOptions.callbacks?.jwt;

    expect(jwtCallback).toBeDefined();

    const token = await jwtCallback!(
      {
        token: {},
        user: {
          id: 'user-1',
          name: 'Teste',
          email: 'teste@mentesolidaria.app',
          perfil: 'paciente',
          supabaseAccessToken: 'supabase-token'
        }
      } as any
    );

    expect(token.supabaseAccessToken).toBe('supabase-token');
  });
});
