import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CVVBanner } from '@/components/CVVBanner';
import { HeaderNav } from '@/components/HeaderNav';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { SITE_DESCRIPTION_LONG, SITE_NAME, SITE_TAGLINE, getSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — Saúde mental gratuita`,
    template: `%s · ${SITE_NAME}`
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    'saúde mental gratuita',
    'psicólogo voluntário',
    'acolhimento psicológico',
    'apoio emocional',
    'CVV 188',
    'CAPS',
    'clínica-escola',
    'LGPD',
    'Brasil'
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Saúde mental gratuita`,
    description: SITE_TAGLINE,
    url: getSiteUrl()
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE
  },
  alternates: {
    canonical: '/'
  }
};

export const viewport: Viewport = {
  themeColor: '#C22251',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: SITE_NAME,
  description: SITE_DESCRIPTION_LONG,
  url: getSiteUrl(),
  logo: `${getSiteUrl()}/icon.svg`,
  areaServed: { '@type': 'Country', name: 'Brasil' },
  knowsLanguage: 'pt-BR',
  medicalSpecialty: ['Psychiatric', 'Psychological'],
  isAcceptingNewPatients: true,
  sameAs: [
    // Atualize quando publicarmos perfis sociais oficiais.
  ],
  potentialAction: {
    '@type': 'RegisterAction',
    target: `${getSiteUrl()}/cadastro-paciente`,
    name: 'Solicitar acolhimento'
  }
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: getSiteUrl(),
  inLanguage: 'pt-BR',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${getSiteUrl()}/diretorio?uf={uf}`,
    'query-input': 'required name=uf'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <a className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-coral focus:px-3 focus:py-2 focus:text-white" href="#conteudo-principal">
          Pular para o conteúdo
        </a>
        <HeaderNav />
        <main className="flex-1" id="conteudo-principal">{children}</main>
        <Footer />
        <CVVBanner />
      </body>
    </html>
  );
}
