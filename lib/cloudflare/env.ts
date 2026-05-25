export interface CloudflareKVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface CloudflareD1Database {
  prepare(query: string): unknown;
}

export interface CloudflareEnv {
  DB?: CloudflareD1Database;
  CACHE_KV?: CloudflareKVNamespace;
  USE_SUPABASE?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_KV_NAMESPACE_ID?: string;
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
}

const globalWithCloudflareEnv = globalThis as typeof globalThis & {
  cloudflareEnv?: Partial<CloudflareEnv>;
  __cloudflareEnv__?: Partial<CloudflareEnv>;
};

function readCloudflareGlobalEnv(): Partial<CloudflareEnv> | null {
  if (globalWithCloudflareEnv.cloudflareEnv) {
    return globalWithCloudflareEnv.cloudflareEnv;
  }

  if (globalWithCloudflareEnv.__cloudflareEnv__) {
    return globalWithCloudflareEnv.__cloudflareEnv__;
  }

  return null;
}

export function getCloudflareEnv(): CloudflareEnv {
  const edgeEnv = readCloudflareGlobalEnv();

  if (edgeEnv) {
    return edgeEnv;
  }

  return {
    USE_SUPABASE: process.env.USE_SUPABASE,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_KV_NAMESPACE_ID: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    CALCOM_API_KEY: process.env.CALCOM_API_KEY,
    CALCOM_BASE_URL: process.env.CALCOM_BASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
    WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY,
    NEXT_PUBLIC_MEDPLUM_BASE_URL: process.env.NEXT_PUBLIC_MEDPLUM_BASE_URL,
    MEDPLUM_CLIENT_ID: process.env.MEDPLUM_CLIENT_ID,
    MEDPLUM_CLIENT_SECRET: process.env.MEDPLUM_CLIENT_SECRET
  };
}
