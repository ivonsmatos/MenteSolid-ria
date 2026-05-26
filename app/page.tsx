import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { SITE_NAME, SITE_TAGLINE, getSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} — Saúde mental gratuita`,
  description: SITE_TAGLINE,
  alternates: { canonical: '/' }
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O MenteSolidária é gratuito?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O acolhimento e o encaminhamento a profissionais voluntários são 100% gratuitos para o paciente.'
      }
    },
    {
      '@type': 'Question',
      name: 'Como solicitar atendimento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Acesse /cadastro-paciente, preencha o formulário e aceite o termo LGPD. Você entra na fila de acolhimento de profissionais voluntários.'
      }
    },
    {
      '@type': 'Question',
      name: 'Onde encontro ajuda em situação de risco?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O CVV — Centro de Valorização da Vida atende 24h gratuitamente pelo telefone 188.'
      }
    }
  ]
};

export default function HomePage() {
  return (
    <section className="space-y-6">
      <JsonLd data={faqJsonLd} />
      <h1 className="text-3xl font-bold text-slate-900">
        Plataforma de acolhimento em saúde mental gratuita
      </h1>
      <p className="max-w-3xl text-slate-700">
        O {SITE_NAME} conecta pessoas em vulnerabilidade a profissionais voluntários por meio de
        triagem estruturada e encaminhamento humanizado. Atendemos em todo o Brasil, com respeito
        à LGPD e canal de emergência (CVV 188) sempre acessível.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Link className="rounded-lg bg-blue-600 p-6 text-white shadow hover:shadow-md" href="/acolhimento">
          <h2 className="text-xl font-semibold">Quero conversar agora</h2>
          <p className="mt-2 text-blue-100">
            Comece o acolhimento por IA, sem cadastro. Em minutos, organizamos seu caso para
            um profissional voluntário entrar em contato.
          </p>
        </Link>
        <Link className="rounded-lg bg-white p-6 shadow hover:shadow-md" href="/cadastro-paciente">
          <h2 className="text-xl font-semibold">Prefiro um formulário simples</h2>
          <p className="mt-2 text-slate-600">
            Pulei a conversa. Apenas registro meus dados para entrar na fila.
          </p>
        </Link>
      </div>
      <div className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p>
          Sou profissional voluntário? <Link className="text-blue-700 underline" href="/login">Entrar</Link>.
        </p>
        <p className="mt-1">
          Procuro um CAPS ou clínica-escola perto de mim:{' '}
          <Link className="text-blue-700 underline" href="/diretorio">Consultar diretório</Link>.
        </p>
      </div>
      <p className="text-sm text-slate-500">
        Conheça também a{' '}
        <Link className="underline" href="/politica-lgpd">política de privacidade</Link>.
      </p>
    </section>
  );
}
