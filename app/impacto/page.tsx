import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { CTAFinal } from '@/components/CTAFinal';

export const metadata: Metadata = {
  title: 'Nosso impacto',
  description:
    'Métricas, histórias e relatórios de impacto do MenteSolidária — quantas pessoas foram acolhidas, quantos profissionais voluntários, ESG e transparência.',
  alternates: { canonical: '/impacto' }
};

const numeros = [
  { v: '100%', l: 'gratuito para o paciente' },
  { v: '24h', l: 'CVV 188 destacado em toda página' },
  { v: '<5min', l: 'do desabafo à primeira resposta da IA' },
  { v: 'LGPD', l: 'consentimento versionado e auditado' }
];

export default function ImpactoPage() {
  return (
    <>
      <Hero
        chapeu="Transparência"
        ctas={[
          { href: '/sobre', label: 'Quem somos' },
          { href: '/contato', label: 'Quero apoiar', variante: 'secondary' }
        ]}
        imagem="encontroComunidade"
        subtitulo="Acreditamos em impacto mensurável. Aqui você vê o que entregamos, sem floreio."
        titulo="Impacto real, números honestos."
        tom="sun"
      />

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-4">
          {numeros.map((n) => (
            <div className="card text-center" key={n.l}>
              <p className="text-4xl font-bold text-coral">{n.v}</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{n.l}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-4 text-slate-800">
          <h2 className="text-2xl font-bold text-slate-900">O que vamos publicar a partir de 2026</h2>
          <ul className="space-y-2 text-lg">
            <li>· Pessoas acolhidas por estado e mês.</li>
            <li>· Profissionais voluntários ativos por especialidade.</li>
            <li>· Tempo médio entre cadastro e primeiro atendimento.</li>
            <li>· Casos prioritários encaminhados ao CVV.</li>
            <li>· Horas voluntárias certificadas.</li>
          </ul>
          <p className="text-sm text-slate-600">
            Os dados serão agregados e anonimizados, em conformidade com LGPD.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-4 text-slate-800">
          <h2 className="text-2xl font-bold text-slate-900">Como nos sustentamos</h2>
          <p className="text-lg">
            O atendimento social é e sempre será gratuito. A operação é financiada por:
          </p>
          <ul className="space-y-2 text-lg">
            <li>· <strong>Plano Freemium</strong> opcional para profissionais usarem a infraestrutura com sua carteira particular.</li>
            <li>· <strong>Editais e fundos ESG</strong> de healthtech e terceiro setor.</li>
            <li>· <strong>Patrocínios institucionais</strong> de empresas comprometidas com saúde mental.</li>
          </ul>
        </div>
      </section>

      <CTAFinal
        ctaPrimario={{ href: '/contato?assunto=parceria', label: 'Quero apoiar' }}
        ctaSecundario={{ href: '/para-profissionais', label: 'Sou profissional' }}
        titulo="Vamos crescer juntos?"
        tom="mint"
      />
    </>
  );
}
