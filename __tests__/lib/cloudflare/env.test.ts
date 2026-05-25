import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCloudflareEnv } from '@/lib/cloudflare/env';

const globalScope = globalThis as typeof globalThis & {
  cloudflareEnv?: { USE_SUPABASE?: string };
};

describe('cloudflare/env', () => {
  afterEach(() => {
    delete globalScope.cloudflareEnv;
    vi.unstubAllEnvs();
  });

  it('deve priorizar bindings globais do runtime edge', () => {
    globalScope.cloudflareEnv = { USE_SUPABASE: 'true' };

    const env = getCloudflareEnv();

    expect(env.USE_SUPABASE).toBe('true');
  });

  it('deve usar process.env no ambiente local', () => {
    vi.stubEnv('USE_SUPABASE', 'false');

    const env = getCloudflareEnv();

    expect(env.USE_SUPABASE).toBe('false');
  });
});
