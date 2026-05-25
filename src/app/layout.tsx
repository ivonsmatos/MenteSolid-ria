import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MenteSolidária — Saúde Mental Acessível',
  description:
    'Plataforma de acolhimento e encaminhamento para saúde mental, conectando pessoas em vulnerabilidade a profissionais voluntários.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MenteSolidária'
  },
  openGraph: {
    title: 'MenteSolidária — Saúde Mental Acessível',
    description:
      'Acolhimento inicial com empatia, apoio responsável e encaminhamento para cuidado em saúde mental.',
    type: 'website',
    locale: 'pt_BR'
  }
};

export const viewport: Viewport = {
  themeColor: '#2d9e8e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
