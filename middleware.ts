import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/dashboard', '/pacientes', '/profissionais', '/triagem'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requiresAuth = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!requiresAuth) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    const url = request.nextUrl.clone();
    url.pathname = token.perfil === 'paciente' ? '/dashboard/paciente' : '/dashboard/profissional';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/pacientes') && token.perfil === 'paciente') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard/paciente';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/profissionais') && token.perfil === 'paciente') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard/paciente';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/pacientes/:path*', '/profissionais/:path*', '/triagem/:path*']
};
