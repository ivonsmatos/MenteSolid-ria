'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import type { TriagemFunctionArgs } from '@/lib/groq/tools';
import { FinalizarAcolhimentoForm } from '@/components/FinalizarAcolhimentoForm';

type Mensagem = { role: 'user' | 'assistant'; content: string };

const MENSAGEM_INICIAL: Mensagem = {
  role: 'assistant',
  content:
    'Olá, sou o acolhedor inicial do MenteSolidária. Estou aqui pra te escutar. O que está acontecendo com você?'
};

export function AcolhimentoChat() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([MENSAGEM_INICIAL]);
  const [rascunho, setRascunho] = useState('');
  const [aguardando, setAguardando] = useState(false);
  const [risco, setRisco] = useState(false);
  const [triagem, setTriagem] = useState<TriagemFunctionArgs | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const fimDoLog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimDoLog.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens.length]);

  const enviar = async () => {
    const texto = rascunho.trim();
    if (!texto || aguardando || triagem) return;

    const proximas: Mensagem[] = [...mensagens, { role: 'user', content: texto }];
    setMensagens(proximas);
    setRascunho('');
    setAguardando(true);
    setErro(null);

    try {
      const response = await fetch('/api/acolhimento/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: proximas.map((m) => ({ role: m.role, content: m.content })) })
      });
      const payload = await response.json();
      if (!response.ok) {
        setErro(payload.error ?? 'Não consegui responder agora.');
        setAguardando(false);
        return;
      }
      setMensagens((atual) => [...atual, { role: 'assistant', content: payload.reply }]);
      if (payload.riscoDetectado) setRisco(true);
      if (payload.triagem) setTriagem(payload.triagem as TriagemFunctionArgs);
    } catch {
      setErro('Falha de rede. Tente novamente.');
    } finally {
      setAguardando(false);
    }
  };

  return (
    <div className="space-y-4">
      {risco ? (
        <div className="flex items-start gap-3 rounded-2xl border border-coral/30 bg-coral-50 p-4">
          <LifeBuoy aria-hidden className="mt-0.5 h-5 w-5 text-coral" />
          <div className="text-coral-700">
            <p className="font-semibold">Você não está sozinho(a). Por favor, ligue agora para o CVV 188.</p>
            <Link
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-coral px-4 py-1.5 text-sm font-semibold text-white hover:bg-coral-500"
              href="tel:188"
            >
              Ligar 188 (gratuito, 24h)
            </Link>
          </div>
        </div>
      ) : null}

      <div
        aria-live="polite"
        className="max-h-[480px] space-y-3 overflow-y-auto rounded-2xl border border-mint-200 bg-white p-4"
      >
        {mensagens.map((m, i) => (
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
              m.role === 'assistant'
                ? 'bg-mint-100 text-slate-900'
                : 'ml-auto bg-coral text-white'
            }`}
            key={i}
          >
            {m.content}
          </div>
        ))}
        {aguardando ? (
          <p className="text-xs text-slate-500">Acolhedor digitando…</p>
        ) : null}
        <div ref={fimDoLog} />
      </div>

      {erro ? <p className="text-sm text-coral-500">{erro}</p> : null}

      {triagem ? (
        <FinalizarAcolhimentoForm triagem={triagem} />
      ) : (
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void enviar();
          }}
        >
          <label className="sr-only" htmlFor="acolhimento-input">Sua mensagem</label>
          <input
            autoComplete="off"
            className="flex-1 rounded-full border border-mint-200 bg-white px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/30"
            disabled={aguardando}
            id="acolhimento-input"
            onChange={(e) => setRascunho(e.target.value)}
            placeholder="Escreva como você está se sentindo…"
            value={rascunho}
          />
          <button
            className="btn-primary"
            disabled={aguardando || !rascunho.trim()}
            type="submit"
          >
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}
