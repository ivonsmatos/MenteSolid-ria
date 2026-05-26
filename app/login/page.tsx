import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Acesso restrito a profissionais voluntários e equipe administrativa.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: false }
};

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <p className="text-slate-700">
        Profissionais voluntários e admin acessam por link mágico enviado ao e-mail cadastrado.
      </p>
      <Suspense fallback={<p>Carregando…</p>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
