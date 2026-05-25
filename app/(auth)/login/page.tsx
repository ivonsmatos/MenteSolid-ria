'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.')
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    setErro('');
    const callbackUrl = '/dashboard/profissional';

    const result = await signIn('credentials', {
      email: data.email,
      senha: data.senha,
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setErro('Credenciais inválidas.');
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  };

  return (
    <section className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Entrar</h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block text-sm font-medium">E-mail</label>
          <input className="w-full rounded border p-2" type="email" {...register('email')} />
          <p className="text-sm text-red-600">{errors.email?.message}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Senha</label>
          <input className="w-full rounded border p-2" type="password" {...register('senha')} />
          <p className="text-sm text-red-600">{errors.senha?.message}</p>
        </div>

        {erro ? <p className="text-sm text-red-700">{erro}</p> : null}

        <button
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <button
        className="w-full rounded border px-4 py-2 font-medium"
        onClick={() => signIn('google', { callbackUrl: '/dashboard/profissional' })}
        type="button"
      >
        Entrar com Google
      </button>

      <div className="space-y-1 text-sm">
        <p>
          Novo profissional?{' '}
          <Link className="text-blue-700 underline" href="/cadastro/profissional">
            Cadastrar profissional
          </Link>
        </p>
        <p>
          Novo paciente?{' '}
          <Link className="text-blue-700 underline" href="/cadastro/paciente">
            Cadastrar paciente
          </Link>
        </p>
      </div>
    </section>
  );
}
