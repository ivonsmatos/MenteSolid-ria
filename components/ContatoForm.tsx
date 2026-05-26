'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ASSUNTOS = [
  { v: 'duvida',       l: 'Dúvida geral' },
  { v: 'voluntariado', l: 'Quero ser voluntário(a)' },
  { v: 'parceria',     l: 'Parceria institucional / ESG' },
  { v: 'imprensa',     l: 'Imprensa' },
  { v: 'lgpd',         l: 'LGPD / privacidade' }
];

export function ContatoForm() {
  const searchParams = useSearchParams();
  const assuntoInicial = searchParams.get('assunto') ?? 'duvida';
  const [enviado, setEnviado] = useState(false);

  // MVP: o formulário usa o mailto: do navegador, sem backend.
  // Numa próxima iteração, criamos /api/contato com rate limit + envio via Resend/SES.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nome = String(data.get('nome') ?? '');
    const email = String(data.get('email') ?? '');
    const assunto = String(data.get('assunto') ?? 'duvida');
    const mensagem = String(data.get('mensagem') ?? '');
    const body = encodeURIComponent(
      `Nome: ${nome}\nE-mail: ${email}\nAssunto: ${assunto}\n\n${mensagem}`
    );
    window.location.href = `mailto:contato@mentesolidaria.org?subject=${encodeURIComponent(`[Contato] ${assunto}`)}&body=${body}`;
    setEnviado(true);
  };

  return (
    <form className="card space-y-4" onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold text-slate-900">Envie sua mensagem</h2>
      <div>
        <label className="mb-1 block font-medium" htmlFor="c-nome">Nome *</label>
        <input className="w-full rounded border p-2" id="c-nome" name="nome" required />
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="c-email">E-mail *</label>
        <input className="w-full rounded border p-2" id="c-email" name="email" required type="email" />
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="c-assunto">Assunto *</label>
        <select
          className="w-full rounded border p-2"
          defaultValue={assuntoInicial}
          id="c-assunto"
          name="assunto"
        >
          {ASSUNTOS.map((a) => (
            <option key={a.v} value={a.v}>{a.l}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="c-mensagem">Mensagem *</label>
        <textarea className="w-full rounded border p-2" id="c-mensagem" name="mensagem" required rows={5} />
      </div>
      <button className="btn-primary w-full" type="submit">Enviar pelo meu e-mail</button>
      {enviado ? (
        <p className="text-sm text-emerald-700">Seu cliente de e-mail foi aberto. Se nada aconteceu, escreva para contato@mentesolidaria.org.</p>
      ) : null}
      <p className="text-xs text-slate-500">
        Não armazenamos esta mensagem em nenhum servidor — ela é enviada direto do seu cliente de e-mail.
      </p>
    </form>
  );
}
