import Image from 'next/image';
import Link from 'next/link';
import type { ChaveImagem } from '@/lib/imagens';
import { IMG } from '@/lib/imagens';

interface CTA {
  href: string;
  label: string;
  variante?: 'primary' | 'secondary' | 'sunny';
}

interface HeroProps {
  chapeu?: string;
  titulo: string;
  subtitulo: string;
  ctas?: CTA[];
  imagem: ChaveImagem;
  // Tom de fundo. Default = mint suave.
  tom?: 'mint' | 'leaf' | 'sun' | 'cream';
}

const TONS: Record<NonNullable<HeroProps['tom']>, string> = {
  mint: 'from-mint-100 via-cream to-cream',
  leaf: 'from-leaf-50 via-cream to-cream',
  sun:  'from-sun-50 via-cream to-cream',
  cream: 'from-cream to-cream'
};

export function Hero({ chapeu, titulo, subtitulo, ctas = [], imagem, tom = 'mint' }: HeroProps) {
  const img = IMG[imagem];
  return (
    <section
      aria-labelledby="hero-title"
      className={`relative overflow-hidden bg-gradient-to-br ${TONS[tom]}`}
    >
      <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-5 animate-fade-in-up">
          {chapeu ? <span className="chip">{chapeu}</span> : null}
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl" id="hero-title">
            {titulo}
          </h1>
          <p className="max-w-xl text-lg text-slate-700">{subtitulo}</p>
          {ctas.length > 0 ? (
            <div className="flex flex-wrap gap-3 pt-2">
              {ctas.map((c) => (
                <Link
                  className={
                    c.variante === 'secondary'
                      ? 'btn-secondary'
                      : c.variante === 'sunny'
                      ? 'btn-sunny'
                      : 'btn-primary'
                  }
                  href={c.href}
                  key={c.href}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <figure className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-soft md:aspect-[4/3]">
          <Image
            alt={img.alt}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            src={img.url}
          />
          <figcaption className="absolute bottom-0 right-0 m-2 rounded bg-black/40 px-2 py-1 text-[10px] text-white">
            Foto: <a className="underline" href={img.fotografoUrl} rel="noopener noreferrer" target="_blank">{img.fotografo}</a> · Unsplash
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
