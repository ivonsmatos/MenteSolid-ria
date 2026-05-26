export const SITE_NAME = 'MenteSolidária';
export const SITE_TAGLINE =
  'Plataforma social brasileira que conecta pessoas em vulnerabilidade a profissionais voluntários de saúde mental. Acolhimento gratuito, com CVV 188 sempre visível.';
export const SITE_DESCRIPTION_LONG =
  'O MenteSolidária oferece acolhimento inicial gratuito por IA e encaminhamento a psicólogos e psiquiatras voluntários verificados (CRP/CRM). Atende todo o Brasil, com respeito à LGPD, sem emitir diagnóstico médico, e com o canal de emergência CVV 188 sempre acessível.';

export const SITE_KEYWORDS = [
  'saúde mental gratuita',
  'psicólogo voluntário',
  'psiquiatra voluntário',
  'acolhimento psicológico',
  'apoio emocional online',
  'CVV 188',
  'CAPS Brasil',
  'clínica-escola',
  'LGPD saúde',
  'IA saúde mental',
  'triagem saúde mental'
];

export const BRAND_COLORS = {
  cream: '#FFFFFA',
  mint:  '#A9E8D6',
  leaf:  '#BCDB9E',
  sun:   '#FFF791',
  coral: '#C22251',
  ink:   '#1A2E2A'
} as const;

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path.startsWith('/')) return `${base}/${path}`;
  return `${base}${path}`;
}
