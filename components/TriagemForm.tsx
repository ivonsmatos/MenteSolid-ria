'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TriagemInput, triagemSchema } from '@/lib/validators';
import { AlertaPrioridade } from '@/components/AlertaPrioridade';
import type { TriagemEncaminhamento } from '@/types';

type TriagemFormProps = {
  pacienteId: string;
  triagemAtual?: TriagemEncaminhamento | null;
};

export function TriagemForm({ pacienteId, triagemAtual }: TriagemFormProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TriagemInput>({
    resolver: zodResolver(triagemSchema),
    defaultValues: triagemAtual
      ? {
          motivoDaBusca: triagemAtual.motivoDaBusca,
          // O input renderiza uma string com itens separados por vírgula.
          // O onSubmit volta a quebrar em array antes de enviar à API.
          sintomasRelatados: [triagemAtual.sintomasRelatados.join(', ')],
          tempoDeQueixa: triagemAtual.tempoDeQueixa,
          impactoNaRotina: triagemAtual.impactoNaRotina,
          perfilIndicado: triagemAtual.perfilIndicado,
          sinalDeAlerta: triagemAtual.sinalDeAlerta,
          resumoClinicoParaEspecialista: triagemAtual.resumoClinicoParaEspecialista
        }
      : {
          sintomasRelatados: [],
          perfilIndicado: 'indefinido',
          sinalDeAlerta: false
        }
  });

  const sinalDeAlerta = watch('sinalDeAlerta');

  const onSubmit = async (data: TriagemInput) => {
    setApiError('');
    const sintomas = Array.isArray(data.sintomasRelatados)
      ? data.sintomasRelatados
          .flatMap((item) => String(item).split(','))
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const response = await fetch(`/api/pacientes/${pacienteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, sintomasRelatados: sintomas })
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setApiError(body.error ?? 'Não foi possível salvar a triagem.');
      return;
    }
    router.refresh();
  };

  return (
    <form className="space-y-4 rounded-lg bg-white p-6 shadow" onSubmit={handleSubmit(onSubmit)}>
      {sinalDeAlerta ? <AlertaPrioridade /> : null}

      <div>
        <label className="mb-1 block font-medium" htmlFor="t-motivo">Motivo da busca *</label>
        <textarea className="w-full rounded border p-2" id="t-motivo" rows={2} {...register('motivoDaBusca')} />
        <p className="text-sm text-red-600">{errors.motivoDaBusca?.message}</p>
      </div>

      <div>
        <label className="mb-1 block font-medium" htmlFor="t-sintomas">
          Sintomas relatados * (separe por vírgula)
        </label>
        <input
          className="w-full rounded border p-2"
          id="t-sintomas"
          placeholder="Ex.: insônia, desânimo"
          {...register('sintomasRelatados.0')}
        />
        <p className="text-sm text-red-600">{errors.sintomasRelatados?.message?.toString()}</p>
      </div>

      <div>
        <label className="mb-1 block font-medium" htmlFor="t-tempo">Tempo de queixa *</label>
        <input className="w-full rounded border p-2" id="t-tempo" {...register('tempoDeQueixa')} />
        <p className="text-sm text-red-600">{errors.tempoDeQueixa?.message}</p>
      </div>

      <div>
        <label className="mb-1 block font-medium" htmlFor="t-impacto">Impacto na rotina *</label>
        <textarea className="w-full rounded border p-2" id="t-impacto" rows={2} {...register('impactoNaRotina')} />
        <p className="text-sm text-red-600">{errors.impactoNaRotina?.message}</p>
      </div>

      <div>
        <label className="mb-1 block font-medium" htmlFor="t-perfil">Perfil indicado *</label>
        <select className="w-full rounded border p-2" id="t-perfil" {...register('perfilIndicado')}>
          <option value="psicologia">Psicologia</option>
          <option value="psiquiatria">Psiquiatria</option>
          <option value="indefinido">Indefinido</option>
        </select>
        <p className="text-sm text-red-600">{errors.perfilIndicado?.message}</p>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('sinalDeAlerta')} />
        Sinal de alerta (prioridade)
      </label>

      <div>
        <label className="mb-1 block font-medium" htmlFor="t-resumo">Resumo clínico para especialista *</label>
        <textarea
          className="w-full rounded border p-2"
          id="t-resumo"
          rows={4}
          {...register('resumoClinicoParaEspecialista')}
        />
        <p className="text-sm text-red-600">{errors.resumoClinicoParaEspecialista?.message}</p>
      </div>

      {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}

      <button
        className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar triagem'}
      </button>
    </form>
  );
}
