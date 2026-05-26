export const SITE_NAME = 'MenteSolidária';
export const SITE_TAGLINE =
  'Plataforma social que conecta pessoas em vulnerabilidade a profissionais voluntários de saúde mental.';
export const SITE_DESCRIPTION_LONG =
  'O MenteSolidária oferece acolhimento inicial gratuito e encaminhamento a psicólogos e psiquiatras voluntários. Atende todo o Brasil com atendimento humanizado, respeito à LGPD e canal de emergência CVV 188 sempre visível.';

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path.startsWith('/')) return `${base}/${path}`;
  return `${base}${path}`;
}
