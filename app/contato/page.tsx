import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { ContatoForm } from '@/components/ContatoForm';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com a equipe do MenteSolidária: voluntariado, parceria institucional, imprensa, LGPD ou dúvidas gerais.',
  alternates: { canonical: '/contato' }
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: absoluteUrl('/contato'),
  about: {
    '@type': 'Organization',
    name: 'MenteSolidária',
    email: 'contato@mentesolidaria.org',
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', email: 'contato@mentesolidaria.org', availableLanguage: 'pt-BR' },
      { '@type': 'ContactPoint', contactType: 'press', email: 'imprensa@mentesolidaria.org', availableLanguage: 'pt-BR' },
      { '@type': 'ContactPoint', contactType: 'data protection officer', email: 'lgpd@mentesolidaria.org', availableLanguage: 'pt-BR' }
    ]
  }
};

export default function ContatoPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      <Hero
        chapeu="Fale com a gente"
        ctas={[]}
        imagem="paisagemBrasileira"
        subtitulo="Voluntariado, parcerias institucionais, imprensa ou LGPD — escolha o canal certo abaixo."
        titulo="Vamos conversar?"
        tom="mint"
      />

      <section className="container-page py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Canais diretos</h2>
            <ul className="space-y-3 text-slate-800">
              <li>· Geral: <a className="text-coral underline" href="mailto:contato@mentesolidaria.org">contato@mentesolidaria.org</a></li>
              <li>· Imprensa: <a className="text-coral underline" href="mailto:imprensa@mentesolidaria.org">imprensa@mentesolidaria.org</a></li>
              <li>· LGPD / Encarregado: <a className="text-coral underline" href="mailto:lgpd@mentesolidaria.org">lgpd@mentesolidaria.org</a></li>
            </ul>
            <div className="rounded-2xl bg-coral p-6 text-white">
              <p className="font-semibold">Está em crise agora?</p>
              <p className="mt-1 text-sm">
                Use o canal de emergência do CVV antes de qualquer outra coisa.
              </p>
              <Link
                className="mt-3 inline-block rounded-full bg-white px-4 py-2 font-semibold text-coral"
                href="tel:188"
              >
                Ligar CVV 188
              </Link>
            </div>
          </div>
          <Suspense fallback={<p className="text-slate-500">Carregando formulário…</p>}>
            <ContatoForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
