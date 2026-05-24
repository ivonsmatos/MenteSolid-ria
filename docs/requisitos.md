# Requisitos do Produto — MenteSolidária (MVP)

## 1. Objetivo
Construir uma plataforma de saúde mental gratuita com acolhimento inicial estruturado por IA e encaminhamento para profissionais voluntários.

## 2. Público-alvo
- Pacientes em vulnerabilidade socioeconômica.
- Psicólogos e psiquiatras voluntários.

## 3. Funcionalidades principais (MVP)
- Cadastro de pacientes com nome, email, telefone, cidade, estado, data de nascimento, gênero (opcional) e como chegou ao serviço.
- Cadastro de profissionais com nome, email, telefone, cidade, estado, especialidade e número de registro (CRP/CRM).
- Listagem e busca de pacientes cadastrados.
- Formulário de triagem/acolhimento inicial baseado em schema JSON de Function Calling.
- Visualização do resumo de encaminhamento por cliente.

## 4. Regras de negócio
- Email deve ser único por paciente.
- CRP/CRM é obrigatório para profissionais.
- `perfil_indicado` aceita apenas `psicologia`, `psiquiatria` ou `indefinido`.
- Se `sinal_de_alerta = true`, o painel deve exibir aviso de prioridade.
- Nenhum campo de diagnóstico médico deve ser exibido para pacientes.

## 5. Critérios de aceite
- Formulários com validação de campos obrigatórios e mensagens claras.
- Listagem de dados funcional com busca.
- Dados persistidos em armazenamento local do MVP (`data/db.json`) via API.

## 6. Fora do escopo (MVP)
- Integração real com Groq.
- Integração real com Cal.com.
- Integração real com Sanity CMS.
- Integração real com Supabase e pagamentos.
