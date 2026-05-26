import type { Metadata } from 'next';
import Link from 'next/link';
import { TERMO_LGPD_RESUMO, TERMO_LGPD_VERSAO } from '@/lib/lgpd';

export const metadata: Metadata = {
  title: 'Política de Privacidade (LGPD)',
  description:
    'Termo de tratamento de dados pessoais e sensíveis no MenteSolidária, conforme LGPD Art. 11.',
  alternates: { canonical: '/politica-lgpd' }
};

export default function PoliticaLgpdPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Política de Privacidade — LGPD</h1>
        <p className="text-sm text-slate-600">Versão {TERMO_LGPD_VERSAO}</p>
      </header>
      <p className="whitespace-pre-line text-slate-800">{TERMO_LGPD_RESUMO}</p>
      <ul className="list-disc space-y-2 pl-6 text-slate-800">
        <li><strong>Base legal:</strong> tutela da saúde (LGPD Art. 11, II, "f").</li>
        <li><strong>Acesso:</strong> profissionais autenticados e equipe administrativa.</li>
        <li><strong>Retenção:</strong> enquanto o cadastro estiver ativo e enquanto exigido por lei.</li>
        <li><strong>Direitos:</strong> acesso, correção, anonimização, portabilidade, eliminação e revogação de consentimento.</li>
        <li><strong>Contato:</strong> envie sua solicitação para o canal de privacidade do projeto.</li>
      </ul>
      <p>
        <Link className="text-blue-700 underline" href="/">Voltar à página inicial</Link>
      </p>
    </section>
  );
}
