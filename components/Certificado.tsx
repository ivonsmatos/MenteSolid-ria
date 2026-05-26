'use client';

import { ResumoHoras, nivelCertificado, HORAS_PARA_CERTIFICADO_BASICO, HORAS_PARA_CERTIFICADO_AVANCADO } from '@/lib/certificado';

interface Props {
  nome: string;
  numeroRegistro: string;
  especialidade: string;
  resumo: ResumoHoras;
  emissaoEm: string;
}

export function Certificado({ nome, numeroRegistro, especialidade, resumo, emissaoEm }: Props) {
  const nivel = nivelCertificado(resumo.totalHoras);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold">Certificado de voluntariado</h1>
          <p className="text-sm text-slate-600">
            Resumo automático com base nos casos atribuídos a você.
          </p>
        </div>
        <button
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          onClick={() => window.print()}
          type="button"
        >
          Imprimir / Salvar PDF
        </button>
      </div>

      {nivel === 'nenhum' ? (
        <div className="mb-4 rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 print:hidden">
          Você tem <strong>{resumo.totalHoras}h</strong> registradas. O certificado básico exige{' '}
          {HORAS_PARA_CERTIFICADO_BASICO}h. Continue assumindo casos para emitir.
        </div>
      ) : null}

      <article
        aria-label="Certificado"
        className="mx-auto max-w-3xl rounded-lg border-2 border-slate-800 bg-white p-10 shadow-sm print:border-2 print:shadow-none"
      >
        <header className="mb-8 text-center">
          <p className="text-sm uppercase tracking-widest text-slate-500">MenteSolidária</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Certificado de voluntariado em saúde mental
          </h2>
        </header>

        <p className="text-center text-lg leading-relaxed text-slate-800">
          Certificamos que <strong>{nome}</strong>, profissional inscrito sob{' '}
          <strong>{numeroRegistro}</strong> na área de <strong>{especialidade}</strong>, prestou
          atendimento voluntário pela plataforma MenteSolidária.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-6 rounded bg-slate-50 p-6 text-center text-slate-900">
          <div>
            <p className="text-sm text-slate-600">Total de horas</p>
            <p className="mt-1 text-3xl font-bold">{resumo.totalHoras}h</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Casos atendidos</p>
            <p className="mt-1 text-3xl font-bold">{resumo.encerrados + resumo.porStatus.encaminhado}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Casos prioritários</p>
            <p className="mt-1 text-3xl font-bold">{resumo.prioritarios}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Nível</p>
            <p className="mt-1 text-3xl font-bold capitalize">
              {nivel === 'nenhum' ? '—' : nivel}
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-slate-700">
          As horas declaradas representam dedicação efetiva ao acolhimento inicial e
          encaminhamento de pessoas em situação de vulnerabilidade socioeconômica, cumprindo a
          missão social da plataforma. Documento válido para fins de comprovação curricular,
          incluindo concursos públicos e programas de residência que aceitem certificação de
          terceiro setor.
        </p>

        <footer className="mt-10 flex items-end justify-between text-sm text-slate-700">
          <div>
            <p>Emitido em {new Date(emissaoEm).toLocaleDateString('pt-BR')}</p>
            <p className="mt-1 font-mono text-xs text-slate-500">
              ID: {emissaoEm}-{numeroRegistro.replace(/\s|\//g, '')}
            </p>
          </div>
          <div className="text-right">
            <div className="border-t-2 border-slate-800 pt-1">MenteSolidária</div>
            <p className="text-xs text-slate-500">Plataforma de saúde mental gratuita</p>
          </div>
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          article[aria-label='Certificado'], article[aria-label='Certificado'] * {
            visibility: visible;
          }
          article[aria-label='Certificado'] {
            position: absolute;
            left: 0; top: 0;
            width: 100%;
            border: none;
          }
        }
      `}</style>
    </>
  );
}
