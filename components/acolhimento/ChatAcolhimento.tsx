'use client';

import { useState } from 'react';

interface Mensagem {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatAcolhimento() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [entrada, setEntrada] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertaCVV, setAlertaCVV] = useState(false);

  const enviarMensagem = async () => {
    const texto = entrada.trim();
    if (!texto || loading) {
      return;
    }

    const novoHistorico = [...mensagens, { role: 'user' as const, content: texto }];
    setMensagens(novoHistorico);
    setEntrada('');
    setLoading(true);

    try {
      const response = await fetch('/api/groq/acolhimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: texto, historico: mensagens })
      });

      if (!response.ok || !response.body) {
        throw new Error('Falha ao obter resposta do acolhimento.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let raw = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        raw += decoder.decode(value, { stream: true });
      }

      const payload = JSON.parse(raw) as {
        resposta: string;
        alertaCVV: boolean;
      };

      setMensagens((current) => [...current, { role: 'assistant', content: payload.resposta }]);
      setAlertaCVV(payload.alertaCVV);
    } catch {
      setMensagens((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            'Não consegui processar sua mensagem agora. Se houver risco imediato, ligue para o CVV 188.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3 rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Acolhimento inicial</h2>

      <div className="max-h-80 space-y-2 overflow-y-auto rounded border bg-slate-50 p-3">
        {mensagens.length === 0 ? (
          <p className="text-sm text-slate-600">Envie uma mensagem para iniciar o acolhimento.</p>
        ) : null}

        {mensagens.map((mensagem, index) => (
          <article
            className={`rounded p-2 text-sm ${
              mensagem.role === 'assistant' ? 'bg-emerald-100' : 'bg-blue-100'
            }`}
            key={`${mensagem.role}-${index}`}
          >
            {mensagem.content}
          </article>
        ))}
      </div>

      {alertaCVV ? (
        <p className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-800">
          ⚠ Detectamos possível situação crítica. Entre em contato com o{' '}
          <a className="font-semibold underline" href="https://www.cvv.org.br/" rel="noreferrer" target="_blank">
            CVV 188
          </a>
          .
        </p>
      ) : null}

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border p-2"
          onChange={(event) => setEntrada(event.target.value)}
          placeholder="Conte como você está se sentindo..."
          value={entrada}
        />
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          disabled={loading}
          onClick={enviarMensagem}
          type="button"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </section>
  );
}
