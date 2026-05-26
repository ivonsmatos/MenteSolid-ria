import type { Metadata } from 'next';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { CTAFinal } from '@/components/CTAFinal';
import { JsonLd } from '@/components/JsonLd';
import { IMG } from '@/lib/imagens';
import { SITE_NAME, absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Quem somos — saúde mental gratuita no Brasil',
  description:
    'Conheça a missão do MenteSolidária: democratizar o acolhimento inicial em saúde mental para pessoas em vulnerabilidade, em parceria com profissionais voluntários.',
  alternates: { canonical: '/sobre' },
  openGraph: { title: `Quem somos · ${SITE_NAME}`, type: 'website' }
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Sobre o MenteSolidária',
  url: absoluteUrl('/sobre'),
  mainEntity: {
    '@type': 'Organization',
    name: SITE_NAME,
    foundingDate: '2026',
    description:
      'Plataforma social brasileira que conecta pessoas em vulnerabilidade socioeconômica a profissionais voluntários de saúde mental.',
    knowsLanguage: 'pt-BR',
    areaServed: { '@type': 'Country', name: 'Brasil' }
  }
};

export default function SobrePage() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <Hero
        chapeu="Quem somos"
        ctas={[
          { href: '/como-funciona', label: 'Como funciona' },
          { href: '/impacto', label: 'Ver impacto', variante: 'secondary' }
        ]}
        imagem="maosUnidas"
        subtitulo="Saúde mental é direito básico. Construímos uma ponte humana, segura e gratuita entre quem precisa e quem quer ajudar."
        titulo="Cuidar do coletivo começa com cuidar de uma pessoa de cada vez."
        tom="mint"
      />

      <section className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <span className="chip">Por que existimos</span>
            <h2 className="text-3xl font-bold text-slate-900">O sofrimento psíquico não pode esperar fila.</h2>
            <p className="text-lg text-slate-700">
              No Brasil, milhões de pessoas convivem com ansiedade, depressão e luto sem encontrar
              acolhimento. As filas do SUS são longas, atendimento particular é inacessível e quem
              quer ser voluntário se perde em planilhas, e-mails e triagens superficiais.
            </p>
            <p className="text-lg text-slate-700">
              O <strong>{SITE_NAME}</strong> nasce como uma plataforma <strong>gratuita para o
              paciente social</strong>, com tecnologia leve, IA para acolher e profissionais
              humanos para encaminhar.
            </p>
          </div>
          <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
            <Image alt={IMG.diversidade.alt} className="object-cover" fill sizes="(min-width: 768px) 50vw, 100vw" src={IMG.diversidade.url} />
          </figure>
        </div>
      </section>

      <section className="bg-leaf-50 py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-slate-900">Nossos princípios</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                t: 'Gratuito para sempre',
                d: 'O atendimento social é e sempre será 100% gratuito para o paciente.'
              },
              {
                t: 'Sem diagnóstico pela IA',
                d: 'A IA acolhe e organiza. Só profissionais humanos avaliam quadros clínicos.'
              },
              {
                t: 'Privacidade primeiro',
                d: 'Dados sensíveis sob LGPD, com consentimento explícito e trilha de auditoria.'
              }
            ].map((p) => (
              <article className="card" key={p.t}>
                <h3 className="text-lg font-semibold text-slate-900">{p.t}</h3>
                <p className="mt-2 text-sm text-slate-700">{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTAFinal
        ctaPrimario={{ href: '/acolhimento', label: 'Começar acolhimento' }}
        ctaSecundario={{ href: '/para-profissionais', label: 'Sou profissional' }}
        texto="Em 5 minutos, você conversa com nosso acolhedor inicial e entra na fila para um profissional voluntário."
        titulo="Você não precisa carregar isso sozinho(a)."
        tom="mint"
      />
    </>
  );
}
