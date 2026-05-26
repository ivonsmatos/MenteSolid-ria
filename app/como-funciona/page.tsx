import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { CTAFinal } from '@/components/CTAFinal';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Como funciona o acolhimento gratuito',
  description:
    'Passo a passo do acolhimento gratuito em saúde mental: cadastro, conversa com IA, triagem estruturada e encaminhamento a profissional voluntário.',
  alternates: { canonical: '/como-funciona' }
};

const passos = [
  {
    n: 1,
    t: 'Você inicia uma conversa',
    d: 'Sem cadastro, sem fila inicial. Conta o que está sentindo no seu tempo. Nosso acolhedor de IA escuta e faz perguntas gentis.'
  },
  {
    n: 2,
    t: 'A IA organiza um resumo clínico',
    d: 'Sintomas, tempo de queixa, impacto, sinais de risco. Nada disso vira diagnóstico — vira contexto para um humano.'
  },
  {
    n: 3,
    t: 'Você confirma e aceita a LGPD',
    d: 'Só agora seu nome, e-mail e telefone são gravados, com consentimento explícito e versionado.'
  },
  {
    n: 4,
    t: 'Um profissional voluntário assume o caso',
    d: 'Psicólogo ou psiquiatra cadastrado com CRP/CRM válido. Casos com sinal de risco entram primeiro na fila.'
  },
  {
    n: 5,
    t: 'Você é encaminhado(a) ao atendimento',
    d: 'Pelo Cal.com do profissional, presencial, telefone ou videochamada conforme o caso.'
  }
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Como obter acolhimento gratuito em saúde mental no MenteSolidária',
  description: 'Cinco passos para entrar na fila de acolhimento com profissional voluntário.',
  totalTime: 'PT10M',
  url: absoluteUrl('/como-funciona'),
  step: passos.map((p) => ({
    '@type': 'HowToStep',
    position: p.n,
    name: p.t,
    text: p.d
  }))
};

export default function ComoFuncionaPage() {
  return (
    <>
      <JsonLd data={howToJsonLd} />
      <Hero
        chapeu="Como funciona"
        ctas={[{ href: '/acolhimento', label: 'Quero começar agora' }]}
        imagem="conversaCalma"
        subtitulo="Cinco passos curtos, sem burocracia. Você é ouvido(a) por uma IA cuidadosa e atendido(a) por um profissional humano."
        titulo="Do desabafo ao atendimento: 5 passos."
        tom="leaf"
      />

      <section className="container-page py-16">
        <ol className="mx-auto max-w-3xl space-y-6">
          {passos.map((p) => (
            <li className="card flex items-start gap-5" key={p.n}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-coral text-xl font-bold text-white">
                {p.n}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{p.t}</h2>
                <p className="mt-1 text-slate-700">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-mint-100 py-16">
        <div className="container-page mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">E em caso de risco imediato?</h2>
          <p className="mt-3 text-lg text-slate-700">
            Se você ou alguém próximo está em crise, <strong>não espere a fila</strong>. Ligue
            agora para o CVV no <a className="font-bold text-coral underline" href="tel:188">188</a>.
            É gratuito, anônimo e funciona 24 horas. Nossa plataforma destaca esse número em
            todas as telas e prioriza casos com sinais de risco.
          </p>
        </div>
      </section>

      <CTAFinal
        ctaPrimario={{ href: '/acolhimento', label: 'Começar acolhimento' }}
        ctaSecundario={{ href: '/faq', label: 'Tirar dúvidas' }}
        titulo="Pronto(a) para o primeiro passo?"
        tom="sun"
      />
    </>
  );
}
