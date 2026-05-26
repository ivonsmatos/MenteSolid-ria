'use client';

import { createBrowserClient } from '@supabase/ssr';

type DB = any; // TODO: substituir por Database importado de @/types/database.ts

export function getSupabaseBrowser() {
  return createBrowserClient<DB>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
