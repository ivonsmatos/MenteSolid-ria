import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Tipo Database genérico (`any`) porque ainda não geramos os tipos a partir
// do schema com `supabase gen types`. Quando gerar, trocar por `<Database>`
// importado de `@/types/database.ts`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

let cached: ReturnType<typeof createClient<DB>> | null = null;

// Cliente com Service Role — bypassa RLS. Use apenas em Route Handlers
// server-side controlados (ex.: cadastro público de paciente com LGPD).
export function getSupabaseAdmin() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase admin não configurado (faltam env vars).');
  }
  cached = createClient<DB>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return cached;
}
