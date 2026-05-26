'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  pacientePublicoCadastroSchema,
  type PacientePublicoCadastroInput,
  UFS
} from '@/lib/validators';
import type { TriagemFunctionArgs } from '@/lib/groq/tools';
import { ConsentimentoLGPD } from '@/components/ConsentimentoLGPD';

export function FinalizarAcolhimentoForm({ triagem }: { triagem: TriagemFunctionArgs }) {
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PacientePublicoCadastroInput>({
    resolver: zodResolver(pacientePublicoCadastroSchema)
  });

  const onSubmit = async (data: PacientePublicoCadastroInput) => {
    setApiError('');
    const response = await fetch('/api/acolhimento/concluir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paciente: data,
        triagem: {
          motivoDaBusca: triagem.motivo_da_busca,
          sintomasRelatados: triagem.sintomas_relatados,
          tempoDeQueixa: triagem.tempo_de_queixa,
          impactoNaRotina: triagem.impacto_na_rotina,
          perfilIndicado: triagem.perfil_indicado,
          sinalDeAlerta: triagem.sinal_de_alerta,
          resumoClinicoParaEspecialista: triagem.resumo_clinico_para_especialista
        }
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setApiError(payload.error ?? 'Não foi possível concluir o cadastro.');
      return;
    }
    router.push('/cadastro-paciente?ok=1');
  };

  return (
    <form className="space-y-4 rounded-lg bg-white p-6 shadow" onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Resumo da conversa</p>
        <p className="mt-2"><strong>Motivo:</strong> {triagem.motivo_da_busca}</p>
        <p><strong>Tempo de queixa:</strong> {triagem.tempo_de_queixa}</p>
        <p><strong>Impacto:</strong> {triagem.impacto_na_rotina}</p>
        <p><strong>Sintomas:</strong> {triagem.sintomas_relatados.join(', ')}</p>
        <p><strong>Perfil indicado:</strong> {triagem.perfil_indicado}</p>
        {triagem.sinal_de_alerta ? (
          <p className="mt-2 font-semibold text-red-700">⚠ Caso marcado como prioritário.</p>
        ) : null}
      </div>

      <p className="text-sm text-slate-700">
        Pra um profissional voluntário entrar em contato, preciso só de alguns dados.
      </p>

      <div>
        <label className="mb-1 block font-medium" htmlFor="fa-nome">Nome *</label>
        <input className="w-full rounded border p-2" id="fa-nome" {...register('nome')} />
        <p className="text-sm text-red-600">{errors.nome?.message}</p>
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="fa-email">E-mail *</label>
        <input className="w-full rounded border p-2" id="fa-email" type="email" {...register('email')} />
        <p className="text-sm text-red-600">{errors.email?.message}</p>
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="fa-tel">Telefone *</label>
        <input
          className="w-full rounded border p-2"
          id="fa-tel"
          placeholder="(11) 99999-9999"
          {...register('telefone')}
        />
        <p className="text-sm text-red-600">{errors.telefone?.message}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium" htmlFor="fa-cidade">Cidade *</label>
          <input className="w-full rounded border p-2" id="fa-cidade" {...register('cidade')} />
          <p className="text-sm text-red-600">{errors.cidade?.message}</p>
        </div>
        <div>
          <label className="mb-1 block font-medium" htmlFor="fa-uf">UF *</label>
          <select className="w-full rounded border p-2" defaultValue="" id="fa-uf" {...register('uf')}>
            <option value="">Selecione</option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
          <p className="text-sm text-red-600">{errors.uf?.message}</p>
        </div>
      </div>

      <ConsentimentoLGPD errors={errors} register={register} />

      {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}

      <button
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Enviando...' : 'Confirmar e entrar na fila'}
      </button>
    </form>
  );
}
