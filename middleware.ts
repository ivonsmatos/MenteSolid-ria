import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const ROTAS_PUBLICAS = [
  '/',
  '/login',
  '/cadastro-paciente',
  '/politica-lgpd',
  '/acolhimento',
  '/diretorio'
];

const API_PUBLICAS = [
  '/api/pacientes/publico-cadastro',
  '/api/acolhimento/chat',
  '/api/acolhimento/concluir',
  '/api/auth/callback',
  '/api/auth/signout',
  '/api/stripe/webhook'
];

function isPublica(pathname: string): boolean {
  if (ROTAS_PUBLICAS.includes(pathname)) return true;
  if (API_PUBLICAS.some((p) => pathname.startsWith(p))) return true;
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/favicon')) return true;
  return false;
}

// Copia cookies que o Supabase definiu em `source` para uma nova resposta.
// Necessário porque NextResponse.redirect/json descartam os cookies do response original.
function copyCookies(source: NextResponse, target: NextResponse): NextResponse {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
  return target;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublica(pathname)) return NextResponse.next();

  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(toSet) {
          toSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (pathname.startsWith('/api/')) {
      return copyCookies(response, NextResponse.json({ error: 'Não autenticado.' }, { status: 401 }));
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return copyCookies(response, NextResponse.redirect(url));
  }

  const papel = (user.app_metadata?.role as string | undefined) ?? 'anonimo';

  if (pathname.startsWith('/api/profissionais') && request.method !== 'GET' && papel !== 'admin') {
    return copyCookies(response, NextResponse.json({ error: 'Acesso restrito a admin.' }, { status: 403 }));
  }
  if (pathname.startsWith('/profissionais/novo') && papel !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return copyCookies(response, NextResponse.redirect(url));
  }
  if ((pathname.startsWith('/pacientes') || pathname.startsWith('/api/pacientes')) &&
      !['profissional', 'admin'].includes(papel)) {
    if (pathname.startsWith('/api/')) {
      return copyCookies(
        response,
        NextResponse.json({ error: 'Acesso restrito a profissionais.' }, { status: 403 })
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return copyCookies(response, NextResponse.redirect(url));
  }
  if ((pathname.startsWith('/painel') || pathname.startsWith('/api/triagens')) &&
      !['profissional', 'admin'].includes(papel)) {
    if (pathname.startsWith('/api/')) {
      return copyCookies(
        response,
        NextResponse.json({ error: 'Acesso restrito a profissionais.' }, { status: 403 })
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return copyCookies(response, NextResponse.redirect(url));
  }
  if (pathname.startsWith('/api/fhir') && !['profissional', 'admin'].includes(papel)) {
    return copyCookies(
      response,
      NextResponse.json({ error: 'Acesso restrito a profissionais.' }, { status: 403 })
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
