import type { ReactNode } from 'react';

interface Beneficio {
  icone: ReactNode;
  titulo: string;
  texto: string;
}

export function SecaoBeneficios({
  chapeu,
  titulo,
  subtitulo,
  itens
}: {
  chapeu?: string;
  titulo: string;
  subtitulo?: string;
  itens: Beneficio[];
}) {
  return (
    <section className="container-page py-16">
      <header className="mx-auto max-w-3xl space-y-3 text-center">
        {chapeu ? <span className="chip">{chapeu}</span> : null}
        <h2 className="text-3xl font-bold text-slate-900">{titulo}</h2>
        {subtitulo ? <p className="text-lg text-slate-700">{subtitulo}</p> : null}
      </header>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {itens.map((b) => (
          <article className="card" key={b.titulo}>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-mint-100 text-mint-700">
              {b.icone}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{b.titulo}</h3>
            <p className="mt-2 text-sm text-slate-700">{b.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
