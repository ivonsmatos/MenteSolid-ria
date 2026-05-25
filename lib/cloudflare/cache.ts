import { getCloudflareEnv } from '@/lib/cloudflare/env';

const cacheMemoria = new Map<string, { payload: string; expiraEm: number }>();
const padraoSensivel = /(cpf|rg|telefone|email|endereco|paciente|prontuario|clinic|pii|lgpd)/i;

interface CacheEnvelope<T> {
  value: T;
  expiresAt: number;
}

function validarChaveSegura(key: string): void {
  if (padraoSensivel.test(key)) {
    throw new Error('Chave de cache contém marcador sensível e foi bloqueada.');
  }
}

function validarValorSeguro(serializado: string): void {
  if (padraoSensivel.test(serializado)) {
    throw new Error('Payload sensível detectado. Não é permitido cachear dados clínicos ou PII.');
  }
}

export async function cachePut<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (ttlSeconds <= 0) {
    return;
  }

  const serializado = JSON.stringify(value);
  validarChaveSegura(key);
  validarValorSeguro(serializado);

  const expiraEm = Date.now() + ttlSeconds * 1000;
  const envelope = JSON.stringify({
    value,
    expiresAt: expiraEm
  } satisfies CacheEnvelope<T>);
  const env = getCloudflareEnv();

  if (env.CACHE_KV) {
    await env.CACHE_KV.put(key, envelope, { expirationTtl: ttlSeconds });
    return;
  }

  cacheMemoria.set(key, { payload: envelope, expiraEm });
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  validarChaveSegura(key);
  const env = getCloudflareEnv();

  if (env.CACHE_KV) {
    const payload = await env.CACHE_KV.get(key);
    if (!payload) {
      return null;
    }

    const envelope = JSON.parse(payload) as CacheEnvelope<T>;
    if (envelope.expiresAt <= Date.now()) {
      return null;
    }

    return envelope.value;
  }

  const entrada = cacheMemoria.get(key);
  if (!entrada) {
    return null;
  }

  if (entrada.expiraEm <= Date.now()) {
    cacheMemoria.delete(key);
    return null;
  }

  const envelope = JSON.parse(entrada.payload) as CacheEnvelope<T>;
  return envelope.value;
}
