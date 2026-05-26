'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export function LoginForm() {
  const supabase = getSupabaseBrowser();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const erroInicial = searchParams.get('erro');

  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(erroInicial);
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${appUrl}/api/auth/callback?next=${encodeURIComponent(next)}`
      }
    });

    setEnviando(false);
    if (error) {
      setErro(error.message);
      return;
    }
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-mint-700">Link enviado!</h2>
        <p className="mt-2 text-slate-700">
          Verifique a caixa de entrada de <strong>{email}</strong> para entrar.
        </p>
      </div>
    );
  }

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="mb-1 block font-medium" htmlFor="email-login">E-mail</label>
        <input
          autoComplete="email"
          className="w-full rounded-full border border-mint-200 px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/30"
          id="email-login"
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      {erro ? <p className="text-sm text-coral-500">{erro}</p> : null}
      <button className="btn-primary w-full" disabled={enviando} type="submit">
        {enviando ? 'Enviando...' : 'Receber link de acesso'}
      </button>
      <p className="text-sm text-slate-600">
        Acesso restrito a profissionais voluntários e equipe administrativa.
      </p>
    </form>
  );
}
