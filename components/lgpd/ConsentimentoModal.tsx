'use client';

import { useMemo, useState } from 'react';

interface ConsentimentoModalProps {
  open: boolean;
  pacienteId?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function ConsentimentoModal({ open, pacienteId, onConfirm, onClose }: ConsentimentoModalProps) {
  const [liTermos, setLiTermos] = useState(false);
  const [autorizaDados, setAutorizaDados] = useState(false);
  const [scrollCompleto, setScrollCompleto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const habilitado = useMemo(
    () => liTermos && autorizaDados && scrollCompleto && !loading,
    [autorizaDados, liTermos, loading, scrollCompleto]
  );

  if (!open) {
    return null;
  }

  const confirmar = async () => {
    try {
      setLoading(true);
      setErro('');

      if (pacienteId) {
        const response = await fetch('/api/lgpd/consentimento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paciente_id: pacienteId })
        });

        if (!response.ok) {
          setErro('Não foi possível registrar o consentimento LGPD.');
          setLoading(false);
          return;
        }
      }

      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Consentimento LGPD</h2>
        <p className="mt-2 text-sm text-slate-600">
          Leia os termos abaixo, role até o final e confirme os consentimentos obrigatórios.
        </p>

        <div
          className="mt-4 max-h-56 overflow-y-auto rounded border p-3 text-sm text-slate-700"
          onScroll={(event) => {
            const element = event.currentTarget;
            const chegouAoFinal = element.scrollTop + element.clientHeight >= element.scrollHeight - 2;
            if (chegouAoFinal) {
              setScrollCompleto(true);
            }
          }}
        >
          <p>
            Ao utilizar o MenteSolidária, você concorda com o tratamento de dados pessoais e sensíveis
            exclusivamente para acolhimento inicial, triagem e encaminhamento terapêutico, em conformidade com
            a LGPD (Lei nº 13.709/2018).
          </p>
          <p className="mt-2">
            Seus dados serão compartilhados somente com profissionais autorizados, com controles de acesso,
            trilhas de auditoria e medidas de segurança proporcionais ao risco.
          </p>
          <p className="mt-2">
            Você pode solicitar confirmação de tratamento, correção, anonimização e exclusão conforme direitos
            de titular.
          </p>
          <p className="mt-2">
            Em casos críticos com risco de vida, a plataforma destaca orientação de contato com o CVV 188 e
            encaminhamento emergencial.
          </p>
        </div>

        <label className="mt-4 flex items-start gap-2 text-sm">
          <input checked={liTermos} onChange={(e) => setLiTermos(e.target.checked)} type="checkbox" />
          Li e aceito os Termos de Uso e a Política de Privacidade.
        </label>

        <label className="mt-2 flex items-start gap-2 text-sm">
          <input
            checked={autorizaDados}
            onChange={(e) => setAutorizaDados(e.target.checked)}
            type="checkbox"
          />
          Autorizo o tratamento dos meus dados de saúde para fins de encaminhamento terapêutico.
        </label>

        {erro ? <p className="mt-3 text-sm text-red-700">{erro}</p> : null}

        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded border px-4 py-2" onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!habilitado}
            onClick={confirmar}
            type="button"
          >
            {loading ? 'Registrando...' : 'Confirmar consentimento'}
          </button>
        </div>
      </div>
    </div>
  );
}
