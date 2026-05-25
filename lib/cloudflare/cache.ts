import { getCloudflareEnv } from '@/lib/cloudflare/env';

const promptsPublicosGroq = new Set([
  'o que é o mentesolidária?',
  'como funciona o mentesolidária?',
  'como funciona o mentesolidaria?',
  'como agendar atendimento?',
  'como funciona o acolhimento inicial?'
]);

function normalizarCacheKey(key: string): string {
  return key.trim().toLowerCase();
}

export async function cachePut(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const env = getCloudflareEnv();
  const namespace = env.CACHE_KV;
  if (!namespace || ttlSeconds <= 0) {
    return;
  }

  await namespace.put(normalizarCacheKey(key), JSON.stringify(value), {
    expirationTtl: ttlSeconds
  });
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const env = getCloudflareEnv();
  const namespace = env.CACHE_KV;
  if (!namespace) {
    return null;
  }

  const raw = await namespace.get(normalizarCacheKey(key));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function isGroqRespostaNaoSensivelCacheavel(
  mensagem: string,
  historicoTamanho: number
): boolean {
  if (historicoTamanho > 0) {
    return false;
  }

  return promptsPublicosGroq.has(normalizarCacheKey(mensagem));
}
