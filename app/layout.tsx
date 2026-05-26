import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CVVBanner } from '@/components/CVVBanner';
import { HeaderNav } from '@/components/HeaderNav';
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
    'CVV 188',
    'CAPS',
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
  themeColor: '#1d4ed8',
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
  areaServed: { '@type': 'Country', name: 'Brasil' },
  knowsLanguage: 'pt-BR',
  medicalSpecialty: ['Psychiatric', 'Psychological'],
  isAcceptingNewPatients: true,
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
  inLanguage: 'pt-BR'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <HeaderNav />
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 pb-20">{children}</main>
        <CVVBanner />
      </body>
    </html>
  );
}
