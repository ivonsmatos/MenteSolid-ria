# Requisitos do Produto — MenteSolidária

> Documento revisado após o levantamento inicial.
> A próxima evolução do produto está focada em **Sprint 1: Segurança + Supabase** (autenticação, RLS, consentimento LGPD e saída do `data/db.json`).

## 1. Objetivo
Construir uma plataforma de saúde mental gratuita com acolhimento inicial estruturado por IA e encaminhamento para profissionais voluntários.

## 2. Público-alvo
- Pacientes em vulnerabilidade socioeconômica.
- Psicólogos e psiquiatras voluntários.
- Equipe administrativa do MenteSolidária (curadoria do diretório, suporte clínico).

## 3. Funcionalidades principais (MVP)
- Cadastro de pacientes com nome, email, telefone, cidade, estado (UF), data de nascimento, gênero (opcional) e como chegou ao serviço.
- Cadastro de profissionais com nome, email, telefone, cidade, estado (UF), especialidade e número de registro (CRP/CRM).
- Listagem e busca de pacientes cadastrados (restrita a usuários autenticados com papel `profissional` ou `admin`).
- Formulário de triagem/acolhimento inicial baseado em schema JSON de Function Calling.
- Visualização do resumo de encaminhamento por paciente.
- Aviso permanente do CVV 188 acessível em todas as páginas.

## 4. Regras de negócio
- Email deve ser único por paciente.
- CRP/CRM é obrigatório para profissionais e deve seguir o padrão brasileiro (regex específico por conselho).
- `perfilIndicado` aceita apenas `psicologia`, `psiquiatria` ou `indefinido`.
- Se `sinalDeAlerta = true`, o painel deve exibir aviso de prioridade e o CVV 188 deve estar em destaque.
- Nenhum campo de diagnóstico médico (DSM-5, CID) deve ser exibido para pacientes.
- **Nenhuma rota que exponha dados de paciente pode ser acessada sem autenticação.** Acesso a dados clínicos exige papel `profissional` ou `admin`.
- **Cadastro de paciente exige aceite explícito do termo LGPD**, com registro de versão do termo, timestamp e endereço IP.
- **UF deve estar entre as 27 UFs brasileiras válidas** (`AC`, `AL`, `AP`, `AM`, `BA`, `CE`, `DF`, `ES`, `GO`, `MA`, `MT`, `MS`, `MG`, `PA`, `PB`, `PR`, `PE`, `PI`, `RJ`, `RN`, `RS`, `RO`, `RR`, `SC`, `SP`, `SE`, `TO`).
- Telefone deve seguir formato brasileiro válido (10 ou 11 dígitos, com DDD).
- Cada operação clínica sensível (criação/leitura/edição de paciente, registro de triagem) deve gerar trilha de auditoria.

## 5. Critérios de aceite
- Formulários com validação de campos obrigatórios e mensagens claras.
- Listagem de dados funcional com busca.
- Persistência em banco de dados que opere em ambiente serverless (Supabase Postgres), sem dependência de filesystem local em produção.
- **Nenhum endpoint público devolve dados de pacientes ou triagens.**
- **CVV 188 visível em todas as páginas (header ou footer fixo), com link `tel:188`.**
- Aceite LGPD registrado no banco com `versão_termo`, `aceite_em` (timestamp ISO) e `ip` do aceite.
- Aplicação executa em produção sem depender de `data/db.json`.

## 6. Fora do escopo (MVP)
- Integração real com Groq (Sprint 3).
- Integração real com Cal.com (Sprint 3).
- Integração real com Sanity CMS (Sprint 3).
- Geolocalização com mapa interativo dos serviços (Sprint 3+).
- Billing/Stripe e cobrança de assinatura SaaS Freemium (Sprint 4).
- Emissão automática de certificado de horas voluntárias (Sprint 4).
- Multi-idiomas (apenas pt-BR no MVP).
