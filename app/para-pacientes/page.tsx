import type { Metadata } from 'next';
import { Heart, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { SecaoBeneficios } from '@/components/SecaoBeneficios';
import { CTAFinal } from '@/components/CTAFinal';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Para pacientes — acolhimento psicológico gratuito',
  description:
    'Se você está em sofrimento e não sabe a quem recorrer, comece aqui. Acolhimento gratuito, sigiloso e humanizado, com profissional voluntário.',
  alternates: { canonical: '/para-pacientes' },
  keywords: ['psicólogo gratuito', 'apoio psicológico', 'saúde mental gratuita', 'CVV 188']
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Acolhimento inicial gratuito em saúde mental',
  serviceType: 'Mental health intake & referral',
  provider: { '@type': 'MedicalOrganization', name: 'MenteSolidária' },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  isAccessibleForFree: true,
  url: absoluteUrl('/para-pacientes'),
  audience: {
    '@type': 'PeopleAudience',
    audienceType: 'Pessoas em vulnerabilidade socioeconômica com sofrimento psíquico'
  }
};

export default function ParaPacientesPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <Hero
        chapeu="Para você"
        ctas={[
          { href: '/acolhimento', label: 'Conversar agora' },
          { href: '/cadastro-paciente', label: 'Quero só me cadastrar', variante: 'secondary' }
        ]}
        imagem="jovemPensativa"
        subtitulo="Sem julgamento, sem custo, sem burocracia. Aqui você é ouvido(a) primeiro — depois, encaminhado(a) com cuidado a um profissional voluntário."
        titulo="Você merece acolhimento de verdade."
        tom="mint"
      />

      <SecaoBeneficios
        chapeu="Você ganha"
        itens={[
          { icone: <Heart className="h-6 w-6" />, titulo: 'Escuta sem pressa', texto: 'Converse no seu tempo com nosso acolhedor inicial. Sem formulários frios.' },
          { icone: <ShieldCheck className="h-6 w-6" />, titulo: 'CVV 188 sempre visível', texto: 'Em caso de risco, o canal de emergência é destacado em todas as telas.' },
          { icone: <Lock className="h-6 w-6" />, titulo: 'Dados sob LGPD', texto: 'Consentimento explícito e versionado. Você pode pedir exclusão a qualquer momento.' },
          { icone: <Sparkles className="h-6 w-6" />, titulo: 'Prioridade quando precisa', texto: 'Casos com sinal de risco entram primeiro na fila do profissional voluntário.' },
          { icone: <Heart className="h-6 w-6" />, titulo: 'Atendimento humano', texto: 'A IA só escuta e organiza. Quem te atende de fato é um psicólogo ou psiquiatra.' },
          { icone: <ShieldCheck className="h-6 w-6" />, titulo: '100% gratuito', texto: 'Nunca cobramos nada do paciente. Sustentabilidade vem de outras frentes.' }
        ]}
        subtitulo="Tudo pensado pra reduzir atritos no momento mais difícil."
        titulo="O que esperar quando você entra aqui"
      />

      <section className="bg-cream-100 py-16">
        <div className="container-page mx-auto max-w-3xl space-y-4 text-slate-800">
          <h2 className="text-2xl font-bold text-slate-900">O que NÃO somos</h2>
          <ul className="space-y-2 text-lg">
            <li>· <strong>Não somos um pronto-socorro.</strong> Em emergência, ligue <a className="text-coral underline" href="tel:188">CVV 188</a> ou <a className="text-coral underline" href="tel:192">SAMU 192</a>.</li>
            <li>· <strong>Não emitimos diagnóstico.</strong> A IA escuta e organiza; quem avalia é um humano.</li>
            <li>· <strong>Não prescrevemos remédios.</strong> Indicação de medicação é exclusiva do psiquiatra que te atender.</li>
            <li>· <strong>Não substituímos terapia regular.</strong> Somos a porta de entrada, não a única solução.</li>
          </ul>
        </div>
      </section>

      <CTAFinal
        ctaPrimario={{ href: '/acolhimento', label: 'Quero conversar agora' }}
        ctaSecundario={{ href: '/diretorio', label: 'Quero CAPS perto de mim' }}
        texto="Sem cadastro inicial. Você só preenche dados depois de aceitar conversar."
        titulo="Pode começar quando estiver pronto(a)."
        tom="mint"
      />
    </>
  );
}
