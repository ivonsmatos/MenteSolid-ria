import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cacheGet,
  cachePut,
  isGroqRespostaNaoSensivelCacheavel
} from '@/lib/cloudflare/cache';

const globalScope = globalThis as typeof globalThis & {
  cloudflareEnv?: {
    CACHE_KV?: {
      get: (key: string) => Promise<string | null>;
      put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
    };
  };
};

describe('cloudflare/cache', () => {
  afterEach(() => {
    delete globalScope.cloudflareEnv;
    vi.restoreAllMocks();
  });

  it('deve salvar e ler valores no KV quando o binding existir', async () => {
    const storage = new Map<string, string>();
    globalScope.cloudflareEnv = {
      CACHE_KV: {
        async get(key) {
          return storage.get(key) ?? null;
        },
        async put(key, value) {
          storage.set(key, value);
        }
      }
    };

    await cachePut('CalCom:Slots:123', ['09:00'], 60);
    const value = await cacheGet<string[]>('calcom:slots:123');

    expect(value).toEqual(['09:00']);
  });

  it('deve considerar cacheável apenas prompt público sem histórico', () => {
    expect(isGroqRespostaNaoSensivelCacheavel('Como funciona o MenteSolidária?', 0)).toBe(true);
    expect(isGroqRespostaNaoSensivelCacheavel('Estou em crise de ansiedade', 0)).toBe(false);
    expect(isGroqRespostaNaoSensivelCacheavel('Como funciona o MenteSolidária?', 1)).toBe(false);
  });
});
