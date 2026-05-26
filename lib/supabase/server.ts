import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { PapelUsuario } from '@/types';

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          try {
            toSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll é no-op em Server Components; ignorado em leitura.
          }
        }
      }
    }
  );
}

export async function getSessionUser() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getPapel(): Promise<PapelUsuario> {
  const user = await getSessionUser();
  const papel = (user?.app_metadata?.role ?? 'anonimo') as PapelUsuario;
  return papel;
}

export async function requirePapel(...papeisPermitidos: PapelUsuario[]): Promise<void> {
  const papel = await getPapel();
  if (!papeisPermitidos.includes(papel)) {
    throw new AuthError('Acesso negado.', papel === 'anonimo' ? 401 : 403);
  }
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AuthError';
  }
}
