'use client';

import { useState } from 'react';

export function AssinaturaCheckoutButton({ podeContratar }: { podeContratar: boolean }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const contratar = async () => {
    setErro(null);
    setCarregando(true);
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) {
        setErro(payload.error ?? 'Falha ao iniciar pagamento.');
        return;
      }
      if (payload.url) window.location.href = payload.url;
    } catch {
      setErro('Falha de rede. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (!podeContratar) {
    return (
      <p className="rounded border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
        Você já possui um plano ativo.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <button
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        disabled={carregando}
        onClick={() => void contratar()}
        type="button"
      >
        {carregando ? 'Redirecionando...' : 'Contratar plano premium'}
      </button>
      {erro ? <p className="text-sm text-red-600">{erro}</p> : null}
    </div>
  );
}
