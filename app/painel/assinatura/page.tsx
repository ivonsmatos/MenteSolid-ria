import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser, getSupabaseServer } from '@/lib/supabase/server';
import { isStripeConfigured } from '@/lib/stripe';
import { AssinaturaCheckoutButton } from '@/components/AssinaturaCheckoutButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Assinatura',
  robots: { index: false, follow: false }
};

interface AssinaturaRow {
  status: string;
  iniciado_em: string;
  expira_em: string | null;
  stripe_subscription_id: string | null;
}

export default async function AssinaturaPage() {
  const user = await getSessionUser();
  const supabase = await getSupabaseServer();
  const { data: prof } = await supabase
    .from('profissionais')
    .select('id')
    .eq('user_id', user!.id)
    .maybeSingle();
  const profId = (prof as { id: string } | null)?.id ?? null;

  let assinatura: AssinaturaRow | null = null;
  if (profId) {
    const { data } = await supabase
      .from('assinaturas_profissionais')
      .select('status, iniciado_em, expira_em, stripe_subscription_id')
      .eq('profissional_id', profId)
      .maybeSingle();
    assinatura = (data as AssinaturaRow | null) ?? null;
  }

  const status = assinatura?.status ?? 'free';

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Assinatura premium</h1>
        <p className="text-sm text-slate-600">
          O atendimento social é e sempre será gratuito. A assinatura paga libera recursos
          adicionais para usar a plataforma com sua carteira de pacientes particulares.
        </p>
      </header>

      <div className="rounded bg-white p-4 shadow">
        <p className="text-sm text-slate-600">Plano atual</p>
        <p className="mt-1 text-2xl font-bold capitalize">{status}</p>
        {assinatura?.expira_em ? (
          <p className="mt-1 text-sm text-slate-600">
            Renova em {new Date(assinatura.expira_em).toLocaleDateString('pt-BR')}
          </p>
        ) : null}
      </div>

      {!isStripeConfigured() ? (
        <div className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Pagamentos ainda não foram ativados no projeto. Quando estiverem disponíveis, você
          poderá assinar diretamente por aqui.
        </div>
      ) : (
        <AssinaturaCheckoutButton podeContratar={status === 'free' || status === 'canceled'} />
      )}

      <p className="text-xs text-slate-500">
        <Link className="underline" href="/painel">Voltar ao painel</Link>
      </p>
    </section>
  );
}
