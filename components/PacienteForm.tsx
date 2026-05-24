'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PacienteInput, pacienteSchema } from '@/lib/validators';

export function PacienteForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PacienteInput>({
    resolver: zodResolver(pacienteSchema)
  });

  const onSubmit = async (data: PacienteInput) => {
    setApiError('');
    const response = await fetch('/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const payload = await response.json();
      setApiError(payload.error ?? 'Não foi possível cadastrar paciente.');
      return;
    }

    router.push('/pacientes');
    router.refresh();
  };

  return (
    <form className="space-y-4 rounded-lg bg-white p-6 shadow" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block font-medium">Nome *</label>
        <input className="w-full rounded border p-2" {...register('nome')} />
        <p className="text-sm text-red-600">{errors.nome?.message}</p>
      </div>
      <div>
        <label className="mb-1 block font-medium">E-mail *</label>
        <input className="w-full rounded border p-2" type="email" {...register('email')} />
        <p className="text-sm text-red-600">{errors.email?.message}</p>
      </div>
      <div>
        <label className="mb-1 block font-medium">Telefone *</label>
        <input className="w-full rounded border p-2" {...register('telefone')} />
        <p className="text-sm text-red-600">{errors.telefone?.message}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">Cidade *</label>
          <input className="w-full rounded border p-2" {...register('cidade')} />
          <p className="text-sm text-red-600">{errors.cidade?.message}</p>
        </div>
        <div>
          <label className="mb-1 block font-medium">Estado *</label>
          <input className="w-full rounded border p-2" {...register('estado')} />
          <p className="text-sm text-red-600">{errors.estado?.message}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">Data de nascimento</label>
          <input className="w-full rounded border p-2" type="date" {...register('dataNascimento')} />
        </div>
        <div>
          <label className="mb-1 block font-medium">Gênero (opcional)</label>
          <select className="w-full rounded border p-2" defaultValue="" {...register('genero')}>
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="nao_binario">Não binário</option>
            <option value="prefiro_nao_dizer">Prefiro não dizer</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block font-medium">Como chegou ao serviço</label>
        <input className="w-full rounded border p-2" {...register('comoChegou')} />
      </div>

      {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}

      <button
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Salvando...' : 'Cadastrar paciente'}
      </button>
    </form>
  );
}
