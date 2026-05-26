-- =====================================================================
-- MenteSolidária — Sprint 3.5: painel profissional
-- Status de atendimento, atribuição (claim) e link Cal.com por profissional.
-- =====================================================================

-- ---------------------------------------------------------------------
-- triagens.status
-- ---------------------------------------------------------------------
alter table public.triagens
  add column if not exists status text not null default 'novo'
    check (status in ('novo','em_atendimento','encaminhado','encerrado'));

create index if not exists triagens_status_idx on public.triagens(status);

-- ---------------------------------------------------------------------
-- profissionais.cal_link
-- ---------------------------------------------------------------------
alter table public.profissionais
  add column if not exists cal_link text;

-- ---------------------------------------------------------------------
-- Atualizar policies para permitir profissional claim/update via own user_id
-- ---------------------------------------------------------------------

-- Profissional pode atualizar a triagem se for o atribuído OU se ainda não tem ninguém atribuído.
drop policy if exists profissional_atualiza_triagem on public.triagens;

create policy profissional_atualiza_triagem on public.triagens
  for update using (
    public.current_role() in ('profissional','admin')
    and (
      profissional_id is null
      or exists (
        select 1 from public.profissionais p
        where p.id = triagens.profissional_id and p.user_id = auth.uid()
      )
      or public.current_role() = 'admin'
    )
  )
  with check (
    public.current_role() in ('profissional','admin')
  );

-- Profissional pode atualizar seu próprio cadastro (cal_link, telefone etc.)
drop policy if exists profissional_atualiza_proprio on public.profissionais;

create policy profissional_atualiza_proprio on public.profissionais
  for update using (
    public.current_role() in ('profissional','admin')
    and (user_id = auth.uid() or public.current_role() = 'admin')
  )
  with check (
    public.current_role() in ('profissional','admin')
    and (user_id = auth.uid() or public.current_role() = 'admin')
  );

-- ---------------------------------------------------------------------
-- View conveniente: triagens com nome do paciente já agregado
-- (Server Components podem usar select aninhado direto, mas a view ajuda
-- relatórios e debugging.)
-- ---------------------------------------------------------------------
create or replace view public.v_painel_casos
with (security_invoker = true)
as
select
  t.id                       as triagem_id,
  t.status                   as status,
  t.sinal_de_alerta          as sinal_de_alerta,
  t.perfil_indicado          as perfil_indicado,
  t.criado_em                as criado_em,
  t.atualizado_em            as atualizado_em,
  t.profissional_id          as profissional_id,
  p.id                       as paciente_id,
  p.nome                     as paciente_nome,
  p.cidade                   as paciente_cidade,
  p.uf                       as paciente_uf
from public.triagens t
join public.pacientes p on p.id = t.paciente_id;

-- security_invoker = true: a view aplica as policies da identidade que está
-- consultando, herdando o RLS das tabelas-base (não bypassa).
