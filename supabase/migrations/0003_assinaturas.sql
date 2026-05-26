-- =====================================================================
-- MenteSolidária — Sprint 4: Freemium para profissionais
-- Assinaturas Stripe (skeleton — sem efeito até STRIPE_SECRET_KEY definida).
-- =====================================================================

create table if not exists public.assinaturas_profissionais (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references public.profissionais(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null default 'free'
    check (status in ('free', 'trial', 'active', 'past_due', 'canceled')),
  iniciado_em timestamptz not null default now(),
  expira_em timestamptz,
  atualizado_em timestamptz not null default now()
);

create unique index if not exists assinaturas_profissional_uidx
  on public.assinaturas_profissionais(profissional_id);

create index if not exists assinaturas_status_idx
  on public.assinaturas_profissionais(status);

alter table public.assinaturas_profissionais enable row level security;

drop policy if exists profissional_le_propria_assinatura on public.assinaturas_profissionais;
create policy profissional_le_propria_assinatura on public.assinaturas_profissionais
  for select using (
    exists (
      select 1 from public.profissionais p
      where p.id = assinaturas_profissionais.profissional_id and p.user_id = auth.uid()
    )
  );

drop policy if exists admin_assinaturas_tudo on public.assinaturas_profissionais;
create policy admin_assinaturas_tudo on public.assinaturas_profissionais
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- Trigger para manter atualizado_em
drop trigger if exists assinaturas_updated_at on public.assinaturas_profissionais;
create trigger assinaturas_updated_at
  before update on public.assinaturas_profissionais
  for each row execute function public.fn_set_updated_at();
