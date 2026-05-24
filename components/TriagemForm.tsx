'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TriagemInput, triagemSchema } from '@/lib/validators';
import { AlertaPrioridade } from '@/components/AlertaPrioridade';

type TriagemFormProps = {
  pacienteId: string;
  onSaved: () => Promise<void>;
};

export function TriagemForm({ pacienteId, onSaved }: TriagemFormProps) {
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TriagemInput>({
    resolver: zodResolver(triagemSchema),
    defaultValues: {
      sintomasRelatados: [],
      perfilIndicado: 'indefinido',
      sinalDeAlerta: false
    }
  });

  const sinalDeAlerta = watch('sinalDeAlerta');

  const onSubmit = async (data: TriagemInput) => {
    setApiError('');
    const payload = {
      ...data,
      sintomasRelatados: data.sintomasRelatados
        .flatMap((item) => item.split(','))
        .map((item) => item.trim())
        .filter(Boolean)
    };

    const response = await fetch(`/api/pacientes/${pacienteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = await response.json();
      setApiError(body.error ?? 'Não foi possível salvar a triagem.');
      return;
    }

    await onSaved();
  };

  return (
    <form className="space-y-4 rounded-lg bg-white p-6 shadow" onSubmit={handleSubmit(onSubmit)}>
      {sinalDeAlerta ? <AlertaPrioridade /> : null}

      <div>
        <label className="mb-1 block font-medium">Motivo da busca *</label>
        <textarea className="w-full rounded border p-2" rows={2} {...register('motivoDaBusca')} />
        <p className="text-sm text-red-600">{errors.motivoDaBusca?.message}</p>
      </div>

      <div>
        <label className="mb-1 block font-medium">Sintomas relatados * (separe por vírgula)</label>
        <input
          className="w-full rounded border p-2"
          {...register('sintomasRelatados.0')}
          placeholder="Ex.: insônia, desânimo"
        />
        <p className="text-sm text-red-600">{errors.sintomasRelatados?.message as string}</p>
      </div>

      <div>
        <label className="mb-1 block font-medium">Tempo de queixa *</label>
        <input className="w-full rounded border p-2" {...register('tempoDeQueixa')} />
        <p className="text-sm text-red-600">{errors.tempoDeQueixa?.message}</p>
      </div>

      <div>
        <label className="mb-1 block font-medium">Impacto na rotina *</label>
        <textarea className="w-full rounded border p-2" rows={2} {...register('impactoNaRotina')} />
        <p className="text-sm text-red-600">{errors.impactoNaRotina?.message}</p>
      </div>

      <div>
        <label className="mb-1 block font-medium">Perfil indicado *</label>
        <select className="w-full rounded border p-2" {...register('perfilIndicado')}>
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
        <label className="mb-1 block font-medium">Resumo clínico para especialista *</label>
        <textarea
          className="w-full rounded border p-2"
          rows={4}
          {...register('resumoClinicoParaEspecialista')}
        />
        <p className="text-sm text-red-600">{errors.resumoClinicoParaEspecialista?.message}</p>
      </div>

      {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}

      <button
        className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar triagem'}
      </button>
    </form>
  );
}
