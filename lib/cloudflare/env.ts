export interface CloudflareD1Binding {
  readonly __tipo: 'd1';
}

export interface CloudflareKVBinding {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: {
      expirationTtl?: number;
    }
  ): Promise<void>;
}

interface CloudflareEnvGlobal {
  __env__?: Partial<CloudflareEnv>;
  __cloudflare_env__?: Partial<CloudflareEnv>;
}

interface CloudflareContextLike {
  cloudflare?: {
    env?: Partial<CloudflareEnv>;
  };
}

export interface CloudflareEnv {
  DB?: CloudflareD1Binding;
  CACHE_KV?: CloudflareKVBinding;
  USE_SUPABASE?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  NEXTAUTH_SECRET?: string;
  NEXTAUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GROQ_API_KEY?: string;
  CALCOM_API_KEY?: string;
  CALCOM_BASE_URL?: string;
  RESEND_API_KEY?: string;
  WHATSAPP_API_URL?: string;
  WHATSAPP_API_KEY?: string;
  NEXT_PUBLIC_MEDPLUM_BASE_URL?: string;
  MEDPLUM_CLIENT_ID?: string;
  MEDPLUM_CLIENT_SECRET?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_KV_NAMESPACE_ID?: string;
}

function lerProcessEnv(): Partial<CloudflareEnv> {
  if (typeof process === 'undefined') {
    return {};
  }

  return process.env as Partial<CloudflareEnv>;
}

export function getCloudflareEnv(context?: CloudflareContextLike): CloudflareEnv {
  const globalEnv = globalThis as unknown as CloudflareEnvGlobal;
  const envBindings =
    context?.cloudflare?.env ?? globalEnv.__env__ ?? globalEnv.__cloudflare_env__ ?? {};
  const processEnv = lerProcessEnv();

  return {
    DB: envBindings.DB,
    CACHE_KV: envBindings.CACHE_KV,
    USE_SUPABASE: envBindings.USE_SUPABASE ?? processEnv.USE_SUPABASE ?? 'false',
    NEXT_PUBLIC_SUPABASE_URL:
      envBindings.NEXT_PUBLIC_SUPABASE_URL ?? processEnv.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      envBindings.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY:
      envBindings.SUPABASE_SERVICE_ROLE_KEY ?? processEnv.SUPABASE_SERVICE_ROLE_KEY,
    NEXTAUTH_SECRET: envBindings.NEXTAUTH_SECRET ?? processEnv.NEXTAUTH_SECRET,
    NEXTAUTH_URL: envBindings.NEXTAUTH_URL ?? processEnv.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: envBindings.GOOGLE_CLIENT_ID ?? processEnv.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: envBindings.GOOGLE_CLIENT_SECRET ?? processEnv.GOOGLE_CLIENT_SECRET,
    GROQ_API_KEY: envBindings.GROQ_API_KEY ?? processEnv.GROQ_API_KEY,
    CALCOM_API_KEY: envBindings.CALCOM_API_KEY ?? processEnv.CALCOM_API_KEY,
    CALCOM_BASE_URL: envBindings.CALCOM_BASE_URL ?? processEnv.CALCOM_BASE_URL,
    RESEND_API_KEY: envBindings.RESEND_API_KEY ?? processEnv.RESEND_API_KEY,
    WHATSAPP_API_URL: envBindings.WHATSAPP_API_URL ?? processEnv.WHATSAPP_API_URL,
    WHATSAPP_API_KEY: envBindings.WHATSAPP_API_KEY ?? processEnv.WHATSAPP_API_KEY,
    NEXT_PUBLIC_MEDPLUM_BASE_URL:
      envBindings.NEXT_PUBLIC_MEDPLUM_BASE_URL ?? processEnv.NEXT_PUBLIC_MEDPLUM_BASE_URL,
    MEDPLUM_CLIENT_ID: envBindings.MEDPLUM_CLIENT_ID ?? processEnv.MEDPLUM_CLIENT_ID,
    MEDPLUM_CLIENT_SECRET: envBindings.MEDPLUM_CLIENT_SECRET ?? processEnv.MEDPLUM_CLIENT_SECRET,
    CLOUDFLARE_ACCOUNT_ID: envBindings.CLOUDFLARE_ACCOUNT_ID ?? processEnv.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: envBindings.CLOUDFLARE_API_TOKEN ?? processEnv.CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_KV_NAMESPACE_ID:
      envBindings.CLOUDFLARE_KV_NAMESPACE_ID ?? processEnv.CLOUDFLARE_KV_NAMESPACE_ID
  };
}
