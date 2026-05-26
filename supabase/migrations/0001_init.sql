-- =====================================================================
-- MenteSolidária — Sprint 1: schema base + RLS + auditoria
-- =====================================================================

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.current_role()
returns text language sql stable as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role'),
    'anonimo'
  )
$$;

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  nome text not null,
  email text not null unique,
  telefone text not null,
  cidade text not null,
  uf char(2) not null
    check (uf in ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
                  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
                  'RS','RO','RR','SC','SP','SE','TO')),
  data_nascimento date,
  genero text check (genero in ('masculino','feminino','nao_binario','prefiro_nao_dizer')),
  como_chegou text,
  criado_em timestamptz not null default now()
);

create table if not exists public.profissionais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  telefone text not null,
  cidade text not null,
  uf char(2) not null,
  especialidade text not null check (especialidade in ('psicologia','psiquiatria')),
  numero_registro text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table if not exists public.triagens (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  profissional_id uuid references public.profissionais(id) on delete set null,
  motivo_da_busca text not null,
  sintomas_relatados text[] not null,
  tempo_de_queixa text not null,
  impacto_na_rotina text not null,
  perfil_indicado text not null check (perfil_indicado in ('psicologia','psiquiatria','indefinido')),
  sinal_de_alerta boolean not null default false,
  resumo_clinico text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists triagens_paciente_idx on public.triagens(paciente_id);
create index if not exists triagens_alerta_idx on public.triagens(sinal_de_alerta) where sinal_de_alerta = true;

create table if not exists public.consentimentos_lgpd (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  versao_termo text not null,
  aceito_em timestamptz not null default now(),
  ip inet,
  user_agent text
);
create index if not exists consentimentos_paciente_idx on public.consentimentos_lgpd(paciente_id);

create table if not exists public.audit_log (
  id bigserial primary key,
  ator_user_id uuid references auth.users(id),
  ator_papel text,
  acao text not null,
  tabela text not null,
  registro_id uuid,
  payload_resumo jsonb,
  ocorrido_em timestamptz not null default now()
);
create index if not exists audit_log_data_idx on public.audit_log(ocorrido_em desc);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.pacientes               enable row level security;
alter table public.profissionais           enable row level security;
alter table public.triagens                enable row level security;
alter table public.consentimentos_lgpd     enable row level security;
alter table public.audit_log               enable row level security;

-- pacientes
drop policy if exists paciente_le_proprio          on public.pacientes;
drop policy if exists profissional_le_pacientes    on public.pacientes;
drop policy if exists admin_pacientes_tudo         on public.pacientes;
drop policy if exists profissional_escreve_paciente on public.pacientes;

create policy paciente_le_proprio on public.pacientes
  for select using (user_id = auth.uid());

create policy profissional_le_pacientes on public.pacientes
  for select using (public.current_role() in ('profissional','admin'));

create policy profissional_escreve_paciente on public.pacientes
  for insert with check (public.current_role() in ('profissional','admin'));

create policy admin_pacientes_tudo on public.pacientes
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- profissionais
drop policy if exists profissional_le_proprio  on public.profissionais;
drop policy if exists profissional_le_todos    on public.profissionais;
drop policy if exists admin_profissionais_tudo on public.profissionais;

create policy profissional_le_proprio on public.profissionais
  for select using (user_id = auth.uid());

create policy profissional_le_todos on public.profissionais
  for select using (public.current_role() in ('profissional','admin'));

create policy admin_profissionais_tudo on public.profissionais
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- triagens
drop policy if exists paciente_le_triagem_propria       on public.triagens;
drop policy if exists profissional_le_triagens          on public.triagens;
drop policy if exists profissional_escreve_triagem      on public.triagens;
drop policy if exists admin_triagens_tudo               on public.triagens;

create policy paciente_le_triagem_propria on public.triagens
  for select using (
    exists (
      select 1 from public.pacientes p
      where p.id = triagens.paciente_id and p.user_id = auth.uid()
    )
  );

create policy profissional_le_triagens on public.triagens
  for select using (public.current_role() in ('profissional','admin'));

create policy profissional_escreve_triagem on public.triagens
  for insert with check (public.current_role() in ('profissional','admin'));

create policy profissional_atualiza_triagem on public.triagens
  for update using (public.current_role() in ('profissional','admin'))
  with check (public.current_role() in ('profissional','admin'));

create policy admin_triagens_tudo on public.triagens
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- consentimentos
drop policy if exists paciente_le_consentimento_proprio on public.consentimentos_lgpd;
drop policy if exists admin_consentimentos_tudo         on public.consentimentos_lgpd;

create policy paciente_le_consentimento_proprio on public.consentimentos_lgpd
  for select using (
    exists (
      select 1 from public.pacientes p
      where p.id = consentimentos_lgpd.paciente_id and p.user_id = auth.uid()
    )
  );

create policy admin_consentimentos_tudo on public.consentimentos_lgpd
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- audit_log
drop policy if exists admin_audit_le on public.audit_log;

create policy admin_audit_le on public.audit_log
  for select using (public.current_role() = 'admin');

-- ---------------------------------------------------------------------
-- Trigger de auditoria genérica
-- ---------------------------------------------------------------------
create or replace function public.fn_audit_log()
returns trigger language plpgsql security definer as $$
declare
  registro_id uuid;
  payload jsonb;
begin
  if (tg_op = 'DELETE') then
    registro_id := (old).id;
    payload := to_jsonb(old);
  else
    registro_id := (new).id;
    payload := to_jsonb(new);
  end if;

  insert into public.audit_log (ator_user_id, ator_papel, acao, tabela, registro_id, payload_resumo)
  values (auth.uid(), public.current_role(), tg_op, tg_table_name, registro_id,
          jsonb_build_object('summary', payload));

  if (tg_op = 'DELETE') then return old; else return new; end if;
end;
$$;

drop trigger if exists audit_pacientes  on public.pacientes;
drop trigger if exists audit_triagens   on public.triagens;

create trigger audit_pacientes
  after insert or update or delete on public.pacientes
  for each row execute function public.fn_audit_log();

create trigger audit_triagens
  after insert or update or delete on public.triagens
  for each row execute function public.fn_audit_log();

-- ---------------------------------------------------------------------
-- Trigger: manter atualizado_em da triagem
-- ---------------------------------------------------------------------
create or replace function public.fn_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

drop trigger if exists triagens_updated_at on public.triagens;
create trigger triagens_updated_at
  before update on public.triagens
  for each row execute function public.fn_set_updated_at();
