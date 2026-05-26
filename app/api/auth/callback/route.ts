import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

// Aceita apenas caminhos relativos seguros para evitar open redirect.
function safeNext(raw: string | null): string {
  if (!raw) return '/';
  if (!raw.startsWith('/')) return '/';
  if (raw.startsWith('//') || raw.startsWith('/\\')) return '/';
  return raw;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));

  if (code) {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?erro=${encodeURIComponent(error.message)}`, url)
      );
    }
  }

  return NextResponse.redirect(new URL(next, url));
}
