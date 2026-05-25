import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const globalForSupabase = globalThis as unknown as {
  supabaseClientSingleton?: ReturnType<typeof createClient> | any;
  supabaseAdminSingleton?: ReturnType<typeof createClient> | any;
};

// Cliente público para operações que devem respeitar RLS.
export const supabaseClient =
  globalForSupabase.supabaseClientSingleton ??
  (createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }) as any);

if (!globalForSupabase.supabaseClientSingleton) {
  globalForSupabase.supabaseClientSingleton = supabaseClient;
}

// Cliente administrativo para rotas internas/auditoria.
export const supabaseAdmin =
  globalForSupabase.supabaseAdminSingleton ??
  (createClient(supabaseUrl, supabaseServiceRoleKey ?? supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }) as any);

if (!globalForSupabase.supabaseAdminSingleton) {
  globalForSupabase.supabaseAdminSingleton = supabaseAdmin;
}
