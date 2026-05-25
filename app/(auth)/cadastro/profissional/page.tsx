'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const cadastroProfissionalSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('E-mail inválido.'),
  telefone: z.string().min(1, 'Telefone é obrigatório.'),
  cidade: z.string().min(1, 'Cidade é obrigatória.'),
  estado: z.string().min(1, 'Estado é obrigatório.'),
  especialidade: z.enum(['psicologia', 'psiquiatria']),
  numeroRegistro: z.string().regex(/^(CRP|CRM)[-\s]?\w{2,}$/i, 'Informe um CRP/CRM válido.'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.')
});

type CadastroProfissionalInput = z.infer<typeof cadastroProfissionalSchema>;

export default function CadastroProfissionalPage() {
  const router = useRouter();
  const [erro, setErro] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CadastroProfissionalInput>({
    resolver: zodResolver(cadastroProfissionalSchema)
  });

  const onSubmit = async (data: CadastroProfissionalInput) => {
    setErro('');

    const response = await fetch('/api/auth/register/profissional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const payload = (await response.json()) as { erro?: string };
      setErro(payload.erro ?? 'Não foi possível concluir o cadastro.');
      return;
    }

    router.push('/login');
  };

  return (
    <section className="mx-auto w-full max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Cadastro de profissional</h1>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nome</label>
          <input className="w-full rounded border p-2" {...register('nome')} />
          <p className="text-sm text-red-600">{errors.nome?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">E-mail</label>
          <input className="w-full rounded border p-2" type="email" {...register('email')} />
          <p className="text-sm text-red-600">{errors.email?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Telefone</label>
          <input className="w-full rounded border p-2" {...register('telefone')} />
          <p className="text-sm text-red-600">{errors.telefone?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Cidade</label>
          <input className="w-full rounded border p-2" {...register('cidade')} />
          <p className="text-sm text-red-600">{errors.cidade?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Estado</label>
          <input className="w-full rounded border p-2" {...register('estado')} />
          <p className="text-sm text-red-600">{errors.estado?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Especialidade</label>
          <select className="w-full rounded border p-2" {...register('especialidade')}>
            <option value="psicologia">Psicologia</option>
            <option value="psiquiatria">Psiquiatria</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">CRP/CRM</label>
          <input className="w-full rounded border p-2" {...register('numeroRegistro')} />
          <p className="text-sm text-red-600">{errors.numeroRegistro?.message}</p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Senha</label>
          <input className="w-full rounded border p-2" type="password" {...register('senha')} />
          <p className="text-sm text-red-600">{errors.senha?.message}</p>
        </div>

        {erro ? <p className="md:col-span-2 text-sm text-red-700">{erro}</p> : null}

        <button className="rounded bg-blue-600 px-4 py-2 text-white" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar e ir para login'}
        </button>
      </form>
    </section>
  );
}
