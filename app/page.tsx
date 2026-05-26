import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, ShieldCheck, Sparkles, Stethoscope, Users } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { SecaoBeneficios } from '@/components/SecaoBeneficios';
import { CTAFinal } from '@/components/CTAFinal';
import { JsonLd } from '@/components/JsonLd';
import { IMG } from '@/lib/imagens';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} — Saúde mental gratuita no Brasil`,
  description: SITE_TAGLINE,
  alternates: { canonical: '/' },
  openGraph: { title: `${SITE_NAME} — Saúde mental gratuita`, type: 'website' }
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O MenteSolidária é gratuito?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O acolhimento e o encaminhamento a profissionais voluntários são 100% gratuitos para o paciente.' }
    },
    {
      '@type': 'Question',
      name: 'Como solicitar atendimento?',
      acceptedAnswer: { '@type': 'Answer', text: 'Acesse /acolhimento e converse com nossa IA, ou preencha o formulário em /cadastro-paciente aceitando o termo LGPD.' }
    },
    {
      '@type': 'Question',
      name: 'Onde encontro ajuda em situação de risco?',
      acceptedAnswer: { '@type': 'Answer', text: 'O CVV — Centro de Valorização da Vida — atende 24h gratuitamente pelo telefone 188.' }
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />

      <Hero
        chapeu="Acolhimento gratuito"
        ctas={[
          { href: '/acolhimento', label: 'Conversar agora' },
          { href: '/para-pacientes', label: 'Sou paciente', variante: 'secondary' }
        ]}
        imagem="heroAcolhimento"
        subtitulo={`O ${SITE_NAME} conecta pessoas em vulnerabilidade a profissionais voluntários de saúde mental no Brasil. Sem custo, sem julgamento, com CVV 188 sempre visível.`}
        titulo="Você não precisa carregar isso sozinho(a)."
        tom="mint"
      />

      {/* Triagem de público — três rotas claras */}
      <section className="container-page py-16">
        <header className="mx-auto max-w-3xl text-center">
          <span className="chip">Por onde começar</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Escolha o caminho que faz sentido pra você</h2>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="card flex flex-col">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-mint-200 text-mint-700">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Quero conversar</h3>
            <p className="mt-2 flex-1 text-slate-700">
              Acolhimento inicial com IA, sem cadastro. Em minutos, organizamos seu caso para um humano.
            </p>
            <Link className="btn-primary mt-4 self-start" href="/acolhimento">Começar acolhimento</Link>
          </article>

          <article className="card flex flex-col">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-200 text-coral">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Sou profissional</h3>
            <p className="mt-2 flex-1 text-slate-700">
              Receba casos triados, gerencie pela agenda Cal.com e emita certificado de horas voluntárias.
            </p>
            <Link className="btn-secondary mt-4 self-start" href="/para-profissionais">Quero ser voluntário</Link>
          </article>

          <article className="card flex flex-col">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-600">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Procuro serviço perto</h3>
            <p className="mt-2 flex-1 text-slate-700">
              CAPS, clínicas-escola e outros serviços públicos por UF, com telefones e fontes oficiais.
            </p>
            <Link className="btn-sunny mt-4 self-start" href="/diretorio">Ver diretório</Link>
          </article>
        </div>
      </section>

      {/* Bloco de imagem narrativa */}
      <section className="bg-mint-100 py-16">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-center">
          <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
            <Image
              alt={IMG.conversaCalma.alt}
              className="object-cover"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              src={IMG.conversaCalma.url}
            />
          </figure>
          <div className="space-y-4">
            <span className="chip">A diferença que faz</span>
            <h2 className="text-3xl font-bold text-slate-900">A IA escuta. O humano cuida.</h2>
            <p className="text-lg text-slate-700">
              Nosso acolhedor por IA foi desenhado por psicólogos: faz perguntas gentis, organiza o
              caso e <strong>nunca emite diagnóstico</strong>. Quem assume o atendimento de verdade
              é um(a) profissional voluntário(a) com CRP ou CRM ativo.
            </p>
            <Link className="btn-secondary" href="/como-funciona">Ver passo a passo</Link>
          </div>
        </div>
      </section>

      <SecaoBeneficios
        chapeu="Por que confiar"
        itens={[
          { icone: <ShieldCheck className="h-6 w-6" />, titulo: 'CVV 188 sempre à mão', texto: 'Canal de emergência destacado em toda página, em camadas determinísticas.' },
          { icone: <Sparkles className="h-6 w-6" />, titulo: 'LGPD e auditoria', texto: 'Consentimento versionado, IP e timestamp, trilha completa em audit log.' },
          { icone: <Heart className="h-6 w-6" />, titulo: 'Gratuito de verdade', texto: 'Nenhum custo, taxa ou “tier” para o paciente social. Pra sempre.' }
        ]}
        subtitulo="Cada decisão técnica foi tomada pensando primeiro em quem está vulnerável."
        titulo="Salvaguardas em todas as camadas"
      />

      <CTAFinal
        ctaPrimario={{ href: '/acolhimento', label: 'Quero conversar agora' }}
        ctaSecundario={{ href: '/contato', label: 'Quero apoiar' }}
        texto="Sem cadastro inicial. Seus dados só são gravados depois do aceite LGPD explícito."
        titulo="Dar o primeiro passo é mais leve do que parece."
        tom="coral"
      />
    </>
  );
}
