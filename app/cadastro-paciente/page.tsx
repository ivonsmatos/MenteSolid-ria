import type { Metadata } from 'next';
import Link from 'next/link';
import { CadastroPacientePublicoForm } from '@/components/CadastroPacientePublicoForm';

export const metadata: Metadata = {
  title: 'Solicitar acolhimento gratuito',
  description:
    'Cadastro gratuito para acolhimento em saúde mental no Brasil. Aceite LGPD obrigatório, dados sensíveis protegidos.',
  alternates: { canonical: '/cadastro-paciente' }
};

type PageProps = { searchParams: Promise<{ ok?: string }> };

export default async function CadastroPacientePage({ searchParams }: PageProps) {
  const { ok } = await searchParams;

  if (ok === '1') {
    return (
      <section className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-emerald-700">Cadastro recebido</h1>
        <p className="text-slate-700">
          Obrigado por confiar no MenteSolidária. Em breve um profissional voluntário entrará
          em contato. Se você estiver em sofrimento intenso agora, ligue para o{' '}
          <Link className="font-semibold text-red-700 underline" href="tel:188">CVV — 188</Link>.
        </p>
        <Link className="text-blue-700 underline" href="/">Voltar à página inicial</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Solicitar acolhimento</h1>
      <p className="text-slate-700">
        Preencha seus dados para entrar na lista de acolhimento. O atendimento é gratuito.
      </p>
      <CadastroPacientePublicoForm />
    </section>
  );
}
