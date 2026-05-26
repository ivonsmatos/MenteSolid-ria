import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Perguntas frequentes — FAQ',
  description:
    'Respostas curtas para dúvidas comuns sobre o acolhimento gratuito do MenteSolidária, LGPD, segurança e voluntariado.',
  alternates: { canonical: '/faq' }
};

const perguntas: Array<{ q: string; a: string }> = [
  {
    q: 'O MenteSolidária é mesmo gratuito?',
    a: 'Sim. O acolhimento inicial e o encaminhamento a um profissional voluntário são 100% gratuitos para o paciente. Nunca cobramos taxa de cadastro, mensalidade ou consulta social.'
  },
  {
    q: 'A IA vai me dar um diagnóstico?',
    a: 'Não. A IA escuta com cuidado, faz perguntas e organiza um resumo clínico para um profissional humano. Diagnóstico só pode ser feito por psicólogo ou psiquiatra cadastrado.'
  },
  {
    q: 'Meus dados estão seguros?',
    a: 'Sim. Seguimos a LGPD: você aceita um termo versionado, com IP e horário registrados. Só profissionais autenticados acessam dados clínicos, e toda operação fica em trilha de auditoria.'
  },
  {
    q: 'Quanto tempo até alguém entrar em contato?',
    a: 'Casos com sinal de risco entram primeiro na fila. Casos comuns seguem ordem de cadastro. Em qualquer momento, se estiver em crise, ligue para o CVV 188 — gratuito, 24h.'
  },
  {
    q: 'Atendem em todo o Brasil?',
    a: 'Sim. A plataforma é online, em pt-BR, e o encaminhamento é feito a profissionais voluntários que aceitam atendimento remoto, presencial ou ambos.'
  },
  {
    q: 'Sou psicólogo(a) ou psiquiatra. Como me cadastro?',
    a: 'O cadastro é por convite da equipe. Solicite acesso pelo formulário de contato com o assunto "voluntariado" e mande seu CRP ou CRM. Nossa equipe valida e te chama por e-mail.'
  },
  {
    q: 'Vocês substituem terapia?',
    a: 'Não. Somos a porta de entrada. O profissional voluntário decide com você os próximos passos: terapia regular, CAPS, clínica-escola ou outro serviço apropriado.'
  },
  {
    q: 'Por que vocês destacam tanto o CVV 188?',
    a: 'Porque a vida vem primeiro. O CVV é o canal nacional de prevenção ao suicídio, gratuito, anônimo e 24h. Sempre que houver sinal de risco, ele aparece com destaque para garantir que ninguém fique sem rota imediata de apoio.'
  }
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: perguntas.map((p) => ({
    '@type': 'Question',
    name: p.q,
    acceptedAnswer: { '@type': 'Answer', text: p.a }
  }))
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <Hero
        chapeu="FAQ"
        ctas={[{ href: '/contato', label: 'Não achei minha dúvida' }]}
        imagem="cuidadoFamilia"
        subtitulo="Respostas diretas para o que costumam perguntar. Se sua dúvida não estiver aqui, fale com a gente."
        titulo="Perguntas frequentes."
        tom="cream"
      />

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-4">
          {perguntas.map((p, i) => (
            <details className="card group cursor-pointer" key={p.q}>
              <summary className="flex items-center justify-between gap-4 text-left">
                <span className="text-lg font-semibold text-slate-900">{`${i + 1}. ${p.q}`}</span>
                <span aria-hidden className="text-coral group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-slate-700">{p.a}</p>
            </details>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-slate-600">
          Não encontrou? <Link className="font-semibold text-coral underline" href="/contato">Mande uma mensagem</Link>.
        </p>
      </section>
    </>
  );
}
