import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser, getSupabaseServer } from '@/lib/supabase/server';
import { calcularHoras } from '@/lib/certificado';
import { Certificado } from '@/components/Certificado';
import type { TriagemStatus } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Certificado de voluntariado',
  robots: { index: false, follow: false }
};

interface ProfissionalRow {
  id: string;
  nome: string;
  numero_registro: string;
  especialidade: string;
}

interface TriagemHorasRow {
  status: string;
  sinal_de_alerta: boolean;
}

export default async function CertificadoPage() {
  const user = await getSessionUser();
  const supabase = await getSupabaseServer();

  const { data: profRaw } = await supabase
    .from('profissionais')
    .select('id, nome, numero_registro, especialidade')
    .eq('user_id', user!.id)
    .maybeSingle();
  const prof = profRaw as ProfissionalRow | null;

  if (!prof) {
    return (
      <section className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">Certificado de voluntariado</h1>
        <p className="text-slate-700">
          Você ainda não tem perfil de profissional vinculado. Solicite ao admin antes de
          emitir certificado.
        </p>
        <Link className="text-blue-700 underline" href="/painel">Voltar ao painel</Link>
      </section>
    );
  }

  const { data: triagensRaw } = await supabase
    .from('triagens')
    .select('status, sinal_de_alerta')
    .eq('profissional_id', prof.id);
  const triagens = (triagensRaw ?? []) as TriagemHorasRow[];

  const resumo = calcularHoras(
    triagens.map((t) => ({
      status: t.status as TriagemStatus,
      sinalDeAlerta: t.sinal_de_alerta
    }))
  );

  return (
    <section className="space-y-6">
      <Certificado
        emissaoEm={new Date().toISOString().slice(0, 10)}
        especialidade={prof.especialidade}
        nome={prof.nome}
        numeroRegistro={prof.numero_registro}
        resumo={resumo}
      />
    </section>
  );
}
