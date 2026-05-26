import type { Metadata } from 'next';
import Link from 'next/link';
import { carregarDiretorio, filtrarServicos, listarUFsComServicos } from '@/lib/diretorio';

export const metadata: Metadata = {
  title: 'Diretório de serviços de saúde mental',
  description:
    'Encontre CAPS, clínicas-escola e outros serviços públicos e de baixo custo em saúde mental no Brasil, por UF.',
  alternates: { canonical: '/diretorio' }
};

type Props = { searchParams: Promise<{ uf?: string }> };

export default async function DiretorioPage({ searchParams }: Props) {
  const { uf } = await searchParams;
  const [{ fontes }, servicos, ufs] = await Promise.all([
    carregarDiretorio(),
    filtrarServicos(uf),
    listarUFsComServicos()
  ]);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Diretório de serviços</h1>
        <p className="text-slate-700">
          Lista inicial curada de CAPS e clínicas-escola. Para a versão completa do mapa nacional,
          consulte as fontes oficiais listadas abaixo.
        </p>
      </header>

      <nav aria-label="Filtro por UF" className="flex flex-wrap gap-2 text-sm">
        <Link
          className={`rounded border px-3 py-1 ${!uf ? 'bg-blue-600 text-white' : 'bg-white'}`}
          href="/diretorio"
        >
          Todas
        </Link>
        {ufs.map((u) => (
          <Link
            className={`rounded border px-3 py-1 ${uf === u ? 'bg-blue-600 text-white' : 'bg-white'}`}
            href={`/diretorio?uf=${u}`}
            key={u}
          >
            {u}
          </Link>
        ))}
      </nav>

      <div className="space-y-3">
        {servicos.map((s) => (
          <article className="rounded bg-white p-4 shadow" key={s.id}>
            <h2 className="font-semibold">{s.nome}</h2>
            <p className="text-sm text-slate-600">
              {s.tipo} · {s.cidade} - {s.uf} · público: {s.publico}
            </p>
            <p className="text-sm text-slate-600">
              Telefone:{' '}
              <Link className="text-blue-700 underline" href={`tel:${s.telefone.replace(/\D/g, '')}`}>
                {s.telefone}
              </Link>
            </p>
          </article>
        ))}
        {!servicos.length ? (
          <p className="text-slate-600">
            Nenhum serviço listado nesta UF. Veja as fontes oficiais abaixo.
          </p>
        ) : null}
      </div>

      <section
        aria-labelledby="fontes"
        className="space-y-2 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
      >
        <h2 className="font-semibold" id="fontes">Fontes oficiais</h2>
        <ul className="list-disc space-y-1 pl-5">
          {fontes.map((f) => (
            <li key={f.url}>
              <a className="text-blue-700 underline" href={f.url} rel="noopener noreferrer" target="_blank">
                {f.nome}
              </a>{' '}
              — {f.descricao}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
