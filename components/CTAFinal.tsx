import Link from 'next/link';

interface CTA {
  titulo: string;
  texto?: string;
  ctaPrimario: { href: string; label: string };
  ctaSecundario?: { href: string; label: string };
  tom?: 'mint' | 'sun' | 'coral';
}

const TONS = {
  mint: 'bg-mint-200',
  sun: 'bg-sun-200',
  coral: 'bg-coral text-white'
} as const;

export function CTAFinal({ titulo, texto, ctaPrimario, ctaSecundario, tom = 'mint' }: CTA) {
  const isCoral = tom === 'coral';
  return (
    <section className={`${TONS[tom]} py-16`}>
      <div className="container-page text-center">
        <h2 className={`mx-auto max-w-2xl text-3xl font-bold ${isCoral ? '' : 'text-slate-900'}`}>
          {titulo}
        </h2>
        {texto ? (
          <p className={`mx-auto mt-3 max-w-2xl text-lg ${isCoral ? 'text-coral-50' : 'text-slate-700'}`}>{texto}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link className={isCoral ? 'btn-sunny' : 'btn-primary'} href={ctaPrimario.href}>
            {ctaPrimario.label}
          </Link>
          {ctaSecundario ? (
            <Link className="btn-secondary" href={ctaSecundario.href}>
              {ctaSecundario.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
