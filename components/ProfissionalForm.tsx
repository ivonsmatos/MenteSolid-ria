'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProfissionalInput, profissionalSchema, UFS } from '@/lib/validators';

export function ProfissionalForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfissionalInput>({
    resolver: zodResolver(profissionalSchema),
    defaultValues: { ativo: true }
  });

  const onSubmit = async (data: ProfissionalInput) => {
    setApiError('');
    const response = await fetch('/api/profissionais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setApiError(payload.error ?? 'Não foi possível cadastrar profissional.');
      return;
    }
    router.push('/profissionais');
    router.refresh();
  };

  return (
    <form className="space-y-4 rounded-lg bg-white p-6 shadow" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block font-medium" htmlFor="pr-nome">Nome *</label>
        <input className="w-full rounded border p-2" id="pr-nome" {...register('nome')} />
        <p className="text-sm text-red-600">{errors.nome?.message}</p>
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="pr-email">E-mail *</label>
        <input className="w-full rounded border p-2" id="pr-email" type="email" {...register('email')} />
        <p className="text-sm text-red-600">{errors.email?.message}</p>
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="pr-telefone">Telefone *</label>
        <input
          className="w-full rounded border p-2"
          id="pr-telefone"
          placeholder="(11) 99999-9999"
          {...register('telefone')}
        />
        <p className="text-sm text-red-600">{errors.telefone?.message}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium" htmlFor="pr-cidade">Cidade *</label>
          <input className="w-full rounded border p-2" id="pr-cidade" {...register('cidade')} />
          <p className="text-sm text-red-600">{errors.cidade?.message}</p>
        </div>
        <div>
          <label className="mb-1 block font-medium" htmlFor="pr-uf">UF *</label>
          <select className="w-full rounded border p-2" defaultValue="" id="pr-uf" {...register('uf')}>
            <option value="">Selecione</option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
          <p className="text-sm text-red-600">{errors.uf?.message}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium" htmlFor="pr-esp">Especialidade *</label>
          <select className="w-full rounded border p-2" defaultValue="" id="pr-esp" {...register('especialidade')}>
            <option value="">Selecione</option>
            <option value="psicologia">Psicologia</option>
            <option value="psiquiatria">Psiquiatria</option>
          </select>
          <p className="text-sm text-red-600">{errors.especialidade?.message}</p>
        </div>
        <div>
          <label className="mb-1 block font-medium" htmlFor="pr-reg">CRP/CRM *</label>
          <input
            className="w-full rounded border p-2"
            id="pr-reg"
            placeholder="CRP 06/123456 ou CRM/SP 123456"
            {...register('numeroRegistro')}
          />
          <p className="text-sm text-red-600">{errors.numeroRegistro?.message}</p>
        </div>
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="pr-cal">Link Cal.com (opcional)</label>
        <input
          className="w-full rounded border p-2"
          id="pr-cal"
          placeholder="https://cal.com/seu-usuario"
          {...register('calLink')}
        />
        <p className="text-sm text-red-600">{errors.calLink?.message}</p>
        <p className="text-xs text-slate-500">
          Quando preenchido, pacientes encaminhados a você verão um botão para agendar.
        </p>
      </div>

      {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}

      <button
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Salvando...' : 'Cadastrar profissional'}
      </button>
    </form>
  );
}
