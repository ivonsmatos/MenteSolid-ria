import 'server-only';
import { createClient } from '@supabase/supabase-js';

let cached: ReturnType<typeof createClient> | null = null;

// Cliente com Service Role — bypassa RLS. Use apenas em Route Handlers
// server-side controlados (ex.: cadastro público de paciente com LGPD).
export function getSupabaseAdmin() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase admin não configurado (faltam env vars).');
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return cached;
}
