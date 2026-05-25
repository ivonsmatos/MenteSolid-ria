'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConsentimentoModal } from '@/components/lgpd/ConsentimentoModal';

const cadastroPacienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('E-mail inválido.'),
  telefone: z.string().min(1, 'Telefone é obrigatório.'),
  cidade: z.string().min(1, 'Cidade é obrigatória.'),
  estado: z.string().min(1, 'Estado é obrigatório.'),
  dataNascimento: z.string().optional(),
  genero: z.enum(['masculino', 'feminino', 'nao_binario', 'prefiro_nao_dizer']).optional(),
  comoChegou: z.string().optional(),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.')
});

type CadastroPacienteInput = z.infer<typeof cadastroPacienteSchema>;

export default function CadastroPacientePage() {
  const router = useRouter();
  const [erro, setErro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dadosPendentes, setDadosPendentes] = useState<CadastroPacienteInput | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CadastroPacienteInput>({
    resolver: zodResolver(cadastroPacienteSchema)
  });

  const solicitarConsentimento = (data: CadastroPacienteInput) => {
    setErro('');
    setDadosPendentes(data);
    setModalOpen(true);
  };

  const confirmarCadastro = async () => {
    if (!dadosPendentes) {
      return;
    }

    const response = await fetch('/api/auth/register/paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...dadosPendentes,
        aceitouLgpd: true
      })
    });

    if (!response.ok) {
      const payload = (await response.json()) as { erro?: string };
      setErro(payload.erro ?? 'Não foi possível concluir o cadastro.');
      return;
    }

    const paciente = (await response.json()) as { id?: string };

    if (paciente.id) {
      await fetch('/api/lgpd/consentimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paciente_id: paciente.id })
      });
    }

    router.push('/login');
  };

  return (
    <section className="mx-auto w-full max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Cadastro de paciente</h1>
      <p className="text-sm text-slate-600">
        O consentimento LGPD é obrigatório antes de concluir o envio dos dados.
      </p>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(solicitarConsentimento)}>
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
          <label className="mb-1 block text-sm font-medium">Data de nascimento</label>
          <input className="w-full rounded border p-2" type="date" {...register('dataNascimento')} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Gênero</label>
          <select className="w-full rounded border p-2" defaultValue="" {...register('genero')}>
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="nao_binario">Não binário</option>
            <option value="prefiro_nao_dizer">Prefiro não dizer</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Como chegou ao serviço</label>
          <input className="w-full rounded border p-2" {...register('comoChegou')} />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Senha</label>
          <input className="w-full rounded border p-2" type="password" {...register('senha')} />
          <p className="text-sm text-red-600">{errors.senha?.message}</p>
        </div>

        {erro ? <p className="md:col-span-2 text-sm text-red-700">{erro}</p> : null}

        <button className="rounded bg-blue-600 px-4 py-2 text-white" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Validando...' : 'Prosseguir para consentimento'}
        </button>
      </form>

      <ConsentimentoModal
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarCadastro}
        open={modalOpen}
      />
    </section>
  );
}
