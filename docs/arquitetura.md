# Arquitetura do Software — MenteSolidária

> Documento revisado após o levantamento.
> **Stack do desenvolvedor:** Next.js + TypeScript (App Router). A persona "dev" do fluxo de trabalho deve ser tratada como **desenvolvedor TypeScript especializado em Next.js**, não Python/Streamlit.

## 1. Arquitetura escolhida
Aplicação monolítica em Next.js (App Router), com páginas e API Routes no mesmo projeto.
Páginas que listam ou exibem dados devem ser **Server Components** (SSR) por padrão, para preservar a estratégia de GEO/SEO do plano de negócios. Componentes interativos (formulários) permanecem como Client Components.

## 2. Estrutura de arquivos
```text
mentesolidaria/
├── app/
│   ├── layout.tsx                 # Header + footer global com CVV 188 fixo
│   ├── page.tsx
│   ├── pacientes/
│   │   ├── page.tsx               # Server Component (lista via Supabase)
│   │   ├── novo/page.tsx
│   │   └── [id]/page.tsx          # Server Component (detalhe)
│   ├── profissionais/
│   │   ├── page.tsx               # Server Component
│   │   └── novo/page.tsx
│   └── api/
│       ├── pacientes/route.ts
│       ├── pacientes/[id]/route.ts
│       ├── profissionais/route.ts
│       └── fhir/                  # Integração aditiva Medplum
│           ├── patient/route.ts
│           └── encounter/route.ts
├── components/
│   ├── PacienteForm.tsx
│   ├── ProfissionalForm.tsx
│   ├── TriagemForm.tsx
│   ├── AlertaPrioridade.tsx
│   ├── CVVBanner.tsx              # (a criar) banner global CVV 188
│   └── ConsentimentoLGPD.tsx      # (a criar) bloco de aceite LGPD
├── lib/
│   ├── supabase/                  # (a criar) cliente server + middleware auth
│   ├── medplum/                   # Cliente FHIR
│   ├── validators.ts              # Zod schemas (incluindo UF, telefone, CRP/CRM)
│   ├── groq-tools.ts
│   └── db.ts                      # ⚠ apenas dev / a ser substituído por Supabase
├── types/
│   ├── index.ts
│   └── fhir.ts
├── docs/
│   ├── requisitos.md
│   ├── arquitetura.md
│   └── medplum-integracao.md
├── data/
│   └── db.json                    # ⚠ apenas dev local — NÃO versionar dados reais
├── .env.example                   # (a criar) variáveis necessárias documentadas
└── README.md
```

## 3. Bibliotecas
**Já no projeto:**
- Next.js 15 + React 18 + TypeScript.
- Tailwind CSS para estilização.
- React Hook Form + Zod para validação.
- `@medplum/core` e `@medplum/fhirtypes` para a camada clínica FHIR.
- `uuid` para IDs únicos.
- `lucide-react` para ícones.

**Sprint 1 (a adicionar):**
- `@supabase/supabase-js` e `@supabase/ssr` para banco + Auth.
- Middleware Next.js (`middleware.ts`) para proteger rotas autenticadas.
- ESLint + script `lint` e `typecheck` no `package.json`.

## 4. Armazenamento de dados
- **Estado atual (transitório):** `data/db.json` lido/escrito por `lib/db.ts` com `fs/promises`. Funciona apenas em `next dev` — **não funciona em ambiente serverless** (Cloudflare Pages, Vercel) por causa do filesystem read-only.
- **Alvo Sprint 1 — Supabase Postgres:**
  - Tabelas: `pacientes`, `profissionais`, `triagens`, `consentimentos_lgpd`, `audit_log`.
  - RLS (Row Level Security) ativada em todas as tabelas: paciente só vê o próprio registro; profissional vê pacientes encaminhados a ele; admin vê tudo.
  - Migrations versionadas em `supabase/migrations/`.
- **Camada FHIR Medplum** segue aditiva e independente, para dados clínicos sensíveis (encaminhamentos, observações, documentos).

## 5. Autenticação e autorização (novo — Sprint 1)
- Provedor: Supabase Auth (e-mail/senha + magic link).
- Papéis: `paciente`, `profissional`, `admin` armazenados como claim em `auth.users.app_metadata.role`.
- Proteção: `middleware.ts` do Next valida sessão e papel; redireciona não autenticado para `/login`.
- API Routes server-side leem o usuário com `supabase.auth.getUser()` e aplicam regra de negócio.

## 6. Compliance LGPD (novo — Sprint 1)
- Bloco `ConsentimentoLGPD` obrigatório no cadastro de paciente.
- Tabela `consentimentos_lgpd` armazena `paciente_id`, `versao_termo`, `aceito_em`, `ip`, `user_agent`.
- Trilha de auditoria em `audit_log` para toda operação clínica sensível (`SELECT`, `INSERT`, `UPDATE` em pacientes/triagens).

## 7. Fluxo da aplicação
1. Usuário não autenticado acessa páginas públicas (home, /login, /cadastro-paciente).
2. No cadastro de paciente, aceite LGPD é registrado antes da criação do registro.
3. Profissional faz login → middleware valida papel → acessa /pacientes (lista renderizada server-side via Supabase com RLS).
4. Profissional abre detalhe → preenche triagem → API valida com Zod → grava em Supabase + opcionalmente espelha em Medplum FHIR (`Encounter`/`Observation`).
5. Se `sinalDeAlerta = true`, UI exibe alerta de prioridade e CVV 188 (que já é global).
6. Operações clínicas geram registro em `audit_log`.

## 8. Decisões deliberadamente fora do MVP atual
- Chat de acolhimento por IA (Groq) — Sprint 3.
- Diretório de serviços (Sanity CMS) — Sprint 3.
- Agendamento Cal.com — Sprint 3.
- PWA (manifest + service worker) — Sprint 2.
- Deploy Cloudflare Pages + Workers — Sprint 4.
- Billing / Freemium / certificação — Sprint 4.
