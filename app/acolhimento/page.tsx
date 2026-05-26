import type { Metadata } from 'next';
import Link from 'next/link';
import { AcolhimentoChat } from '@/components/AcolhimentoChat';

export const metadata: Metadata = {
  title: 'Acolhimento inicial com IA',
  description:
    'Converse com um acolhedor inicial do MenteSolidária. A IA escuta com cuidado e organiza seu caso para um profissional voluntário humano.',
  alternates: { canonical: '/acolhimento' }
};

export default function AcolhimentoPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Acolhimento inicial</h1>
        <p className="text-slate-700">
          Converse com o acolhedor do MenteSolidária. Sua conversa não é diagnóstico médico.
          Em situação de risco, ligue para o <Link className="font-semibold text-red-700 underline" href="tel:188">CVV 188</Link>.
        </p>
      </header>
      <AcolhimentoChat />
      <p className="text-xs text-slate-500">
        Ao usar este canal, você concorda com a{' '}
        <Link className="underline" href="/politica-lgpd">política de privacidade</Link>. Nenhum
        dado é gravado até você confirmar e aceitar o termo LGPD ao final.
      </p>
    </section>
  );
}
