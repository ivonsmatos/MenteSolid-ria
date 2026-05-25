create extension if not exists "pgcrypto";

create table if not exists public.profissionais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  crp_crm text not null,
  especialidade text not null,
  email text unique not null,
  disponivel boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text,
  data_nascimento date,
  telefone text,
  email text,
  genero text,
  vulnerabilidade_socioeconomica boolean,
  created_at timestamptz not null default now(),
  profissional_id uuid references public.profissionais(id)
);

create table if not exists public.triagens (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  profissional_id uuid not null references public.profissionais(id),
  nivel_prioridade text not null,
  alerta_cvv boolean not null default false,
  sintomas text[] not null default '{}',
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.encaminhamentos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id),
  profissional_origem_id uuid references public.profissionais(id),
  profissional_destino_id uuid references public.profissionais(id),
  resumo_clinico text,
  status text not null default 'pendente',
  created_at timestamptz not null default now()
);

create table if not exists public.consentimentos_lgpd (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  versao_termos text not null,
  aceito_em timestamptz not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  acao text not null,
  recurso text not null,
  recurso_id text,
  dados_anteriores jsonb,
  created_at timestamptz not null default now()
);

alter table public.profissionais enable row level security;
alter table public.pacientes enable row level security;
alter table public.triagens enable row level security;
alter table public.encaminhamentos enable row level security;
alter table public.consentimentos_lgpd enable row level security;
alter table public.audit_log enable row level security;

create policy "profissionais_publico_ler"
on public.profissionais
for select
using (true);

create policy "profissionais_publico_criar"
on public.profissionais
for insert
with check (true);

create policy "profissional_ler_proprios_pacientes"
on public.pacientes
for select
using (profissional_id::text = auth.uid()::text);

create policy "pacientes_publico_criar"
on public.pacientes
for insert
with check (true);

create policy "profissional_atualizar_proprios_pacientes"
on public.pacientes
for update
using (profissional_id::text = auth.uid()::text)
with check (profissional_id::text = auth.uid()::text);

create policy "paciente_ler_proprios_dados"
on public.pacientes
for select
using (id::text = auth.uid()::text);

create policy "profissional_ler_proprias_triagens"
on public.triagens
for select
using (profissional_id::text = auth.uid()::text);

create policy "paciente_ler_proprias_triagens"
on public.triagens
for select
using (paciente_id::text = auth.uid()::text);

create policy "profissional_criar_triagens"
on public.triagens
for insert
with check (profissional_id::text = auth.uid()::text);

create policy "profissional_ler_encaminhamentos_destino"
on public.encaminhamentos
for select
using (profissional_destino_id::text = auth.uid()::text);

create policy "profissional_atualizar_status_encaminhamento"
on public.encaminhamentos
for update
using (profissional_destino_id::text = auth.uid()::text)
with check (profissional_destino_id::text = auth.uid()::text);

create policy "encaminhamentos_publico_criar"
on public.encaminhamentos
for insert
with check (true);

create policy "paciente_ler_seus_consentimentos"
on public.consentimentos_lgpd
for select
using (paciente_id::text = auth.uid()::text);

create policy "paciente_criar_consentimento"
on public.consentimentos_lgpd
for insert
with check (paciente_id::text = auth.uid()::text);

create policy "audit_log_apenas_service_role"
on public.audit_log
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
