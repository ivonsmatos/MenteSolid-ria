# 🧠 MenteSolidária

Plataforma digital progressiva de impacto social para conectar pessoas em vulnerabilidade socioeconômica a acolhimento inicial e encaminhamento para profissionais voluntários de saúde mental.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4)
![Supabase Ready](https://img.shields.io/badge/Supabase-ready-3ECF8E)
![Groq Ready](https://img.shields.io/badge/Groq-ready-ff4f00)
![Medplum FHIR](https://img.shields.io/badge/Medplum-FHIR-5A2DFF)

## Proposta de valor
- **Paciente:** acesso gratuito a acolhimento inicial estruturado e priorização de casos críticos.
- **Profissional:** recebimento de triagem organizada para otimizar o primeiro atendimento.

## Stack tecnológica
- [Next.js](https://nextjs.org/) — front-end, App Router e API Routes.
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática.
- [Tailwind CSS](https://tailwindcss.com/) — estilização utilitária.
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — formulários e validação.
- [Supabase](https://supabase.com/) — alvo de migração para persistência com RLS/LGPD.
- [Medplum](https://www.medplum.com/) — camada clínica FHIR para dados sensíveis de saúde.
- [Groq](https://groq.com/) — alvo de integração futura para acolhimento por IA.

## Pré-requisitos
- `node >= 18`
- `npm >= 9`

## Instalação
```bash
git clone https://github.com/ivonsmatos/MenteSolid-ria.git
cd MenteSolid-ria
npm install
npm run dev
```

## Estrutura de arquivos
```text
mentesolidaria/
├── app/                         # Rotas de páginas e APIs Next.js
├── components/                  # Formulários e componentes reutilizáveis
├── lib/                         # Persistência local, validações e schema de tools
├── types/                       # Tipagens centrais da aplicação
├── data/db.json                 # Banco local do MVP
├── docs/requisitos.md           # Especificação de produto
├── docs/arquitetura.md          # Decisões de arquitetura
└── README.md                    # Documentação principal
```

## Funcionalidades MVP
- [x] Cadastro de pacientes com validação
- [x] Cadastro de profissionais com CRP/CRM obrigatório
- [x] Listagem e busca de pacientes
- [x] Triagem inicial estruturada
- [x] Alerta de prioridade com CVV 188
- [x] Persistência local em `data/db.json`

## Camada de Dados Clínicos (FHIR)
- Integração aditiva com Medplum para dados clínicos sensíveis (sem remover a persistência local do MVP).
- Mapeamentos FHIR criados para `Patient`, `Encounter`, `Observation`, `ServiceRequest` e `DocumentReference`.
- Rotas disponíveis:
  - `POST /api/fhir/patient`
  - `GET /api/fhir/patient?id=<id>`
  - `POST /api/fhir/encounter`
- Guia completo em `docs/medplum-integracao.md`.

## Roadmap
- [ ] Integração real com Groq API + Function Calling
- [ ] Migração de persistência para Supabase com RLS
- [ ] Integração Medplum (em progresso)
- [ ] Integração de agenda com Cal.com
- [ ] Integração de diretório com Sanity CMS
- [ ] Deploy em Cloudflare Pages + Workers

## Compliance e Segurança
- Diretrizes de LGPD consideradas para evolução da camada de dados.
- IA não deve emitir diagnóstico médico.
- Casos críticos devem acionar encaminhamento para CVV 188.

## Modelo de Sustentabilidade
- SaaS Freemium para profissionais (atendimento social gratuito + recursos premium para carteira particular).
- Estratégia ESG com captação por editais e parcerias institucionais.
- Certificação de voluntariado para engajamento contínuo.

## Como contribuir
1. Crie uma branch com sua feature.
2. Faça commits pequenos e objetivos.
3. Abra um Pull Request com descrição clara.

## Licença
MIT.
