# 🧠 MenteSolidária

Plataforma digital progressiva de impacto social para conectar pessoas em vulnerabilidade socioeconômica a acolhimento inicial e encaminhamento para profissionais voluntários de saúde mental.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20RLS-3ECF8E)
![Medplum FHIR](https://img.shields.io/badge/Medplum-FHIR-5A2DFF)
![LGPD](https://img.shields.io/badge/LGPD-consentimento%20ativo-success)

> Status: **Sprints 1, 2, 3, 3.5 e 4 concluídos** — segurança + Supabase + LGPD (Sprint 1); GEO/SEO + PWA + testes (Sprint 2); chat Groq + interceptação (Sprint 3); painel profissional + Cal.com (Sprint 3.5); certificação + adapter Sanity + Stripe skeleton + observability (Sprint 4).

## Proposta de valor
- **Paciente:** acesso gratuito a acolhimento inicial estruturado, com transparência LGPD e canal de emergência (CVV 188) visível em todas as páginas.
- **Profissional voluntário:** recebimento de triagem organizada para otimizar o primeiro atendimento; acesso protegido por autenticação e RLS.

## Stack
- **Front-end:** Next.js 15 (App Router, Server Components), TypeScript, Tailwind CSS.
- **Formulários e validação:** React Hook Form + Zod (UF, telefone BR, CRP/CRM com regex).
- **Auth + banco:** Supabase Auth (magic link) + Postgres + RLS por papel.
- **Camada clínica FHIR:** Medplum (`Patient`, `Encounter`, `Observation`, `ServiceRequest`, `DocumentReference`).
- **(Próximos sprints):** Groq, Sanity CMS, Cal.com, Cloudflare Pages.

## Pré-requisitos
- `node >= 20`
- `npm >= 10`
- Projeto Supabase com Auth habilitado (link mágico).
- (Opcional) Conta Medplum cloud/sandbox.

## Instalação

```bash
git clone https://github.com/ivonsmatos/MenteSolid-ria.git
cd MenteSolid-ria
npm install
cp .env.example .env.local
# Preencha .env.local com suas credenciais Supabase (e Medplum, se for usar)
```

### Aplicar migrations no Supabase

Use o SQL Editor do Supabase ou a CLI. **Aplicar em ordem:**

```bash
# Via SQL Editor: cole e execute na ordem
#   1. supabase/migrations/0001_init.sql        (schema + RLS + audit)
#   2. supabase/migrations/0002_painel.sql      (status + cal_link + view painel)
#   3. supabase/migrations/0003_assinaturas.sql (Freemium Stripe — opcional)
#
# Via CLI:
supabase db push   # se estiver com supabase-cli e link configurado
```

### Criar o primeiro admin

Pelo painel Supabase (Auth → Users → Add user):

1. Crie um usuário com seu e-mail.
2. Em `app_metadata`, adicione `{"role":"admin"}`.
3. Faça login na aplicação por `/login` (magic link).

A partir do admin, profissionais podem ser convidados via `/profissionais/novo`.

### Rodar local

```bash
npm run dev
```

App em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sim | Anon key (lado cliente, RLS aplicado) |
| `SUPABASE_SERVICE_ROLE_KEY` | sim | Service role (server-only, bypassa RLS) — usado apenas em rotas controladas |
| `NEXT_PUBLIC_APP_URL` | recomendado | URL absoluta usada no redirect do magic link |
| `NEXT_PUBLIC_MEDPLUM_BASE_URL` | opcional | Base do Medplum (default `https://api.medplum.com/`) |
| `MEDPLUM_CLIENT_ID` / `MEDPLUM_CLIENT_SECRET` | opcional | Credenciais para client credentials Medplum |
| `GROQ_API_KEY` | opcional (necessária para `/acolhimento`) | Chave da API do Groq |
| `GROQ_MODEL` | opcional | Modelo Groq (default `llama-3.3-70b-versatile`) |
| `GROQ_BASE_URL` | opcional | Base URL do Groq (default OpenAI-compatible) |

Configure a mesma origem em **Supabase → Auth → URL Configuration** e em **Redirect URLs**: `http://localhost:3000/api/auth/callback`.

## Scripts

```bash
npm run dev         # desenvolvimento
npm run build       # produção
npm run start       # servir produção
npm run lint        # ESLint (next/core-web-vitals)
npm run typecheck   # TypeScript --noEmit
npm test            # Vitest (unit) — validators, mappers, seo helpers
npm run test:watch  # Vitest em modo watch
```

## Estrutura

```text
mentesolidaria/
├── app/
│   ├── layout.tsx                          # Header + CVV global no footer
│   ├── page.tsx                            # Landing pública
│   ├── login/                              # Magic link
│   ├── cadastro-paciente/                  # Cadastro público com consentimento LGPD
│   ├── politica-lgpd/                      # Texto + versão do termo
│   ├── pacientes/                          # Server Components (auth: profissional/admin)
│   ├── profissionais/                      # Server Components (auth: profissional/admin)
│   └── api/
│       ├── auth/callback/route.ts          # Exchange code (magic link)
│       ├── auth/signout/route.ts
│       ├── pacientes/publico-cadastro/     # Pública — registra paciente + consentimento
│       ├── pacientes/route.ts              # Auth: profissional/admin
│       ├── pacientes/[id]/route.ts
│       ├── profissionais/route.ts          # Auth: admin (cria via invite)
│       └── fhir/                           # Auth + Medplum
├── components/                             # Forms, CVVBanner, HeaderNav, LGPD
├── lib/
│   ├── supabase/{server,client,admin}.ts   # Clientes Supabase + helpers de auth
│   ├── medplum/                            # Mappers FHIR
│   ├── validators.ts                       # Zod (UF, telefone, CRP/CRM, LGPD)
│   ├── mappers.ts                          # row -> tipo de aplicação
│   ├── lgpd.ts                             # Constantes do termo
│   └── groq-tools.ts                       # Schema function call (Sprint 3)
├── middleware.ts                           # Protege rotas/APIs por papel
├── supabase/migrations/                    # Schema + RLS + triggers
├── types/                                  # Tipagens centrais
└── docs/                                   # requisitos, arquitetura, medplum
```

## Modelo de dados

5 tabelas em Postgres com RLS ativa:

- `pacientes` — cadastro demográfico + UF.
- `profissionais` — vínculo `user_id` com `auth.users`, registro CRP/CRM.
- `triagens` — uma por paciente (atualizável), com `sinal_de_alerta`.
- `consentimentos_lgpd` — versão do termo, IP, user-agent, timestamp.
- `audit_log` — trilha automática (triggers em `pacientes` e `triagens`).

### Papéis e RLS

- `paciente` — só vê o próprio cadastro/consentimento.
- `profissional` — lê todos os pacientes e triagens; escreve triagem.
- `admin` — tudo, inclusive convidar profissionais e ler audit log.

Papéis ficam em `auth.users.app_metadata.role`. **Nunca** em `user_metadata` (este é editável pelo cliente).

## Compliance LGPD

- Cadastro público de paciente exige aceite explícito ([app/cadastro-paciente](app/cadastro-paciente/page.tsx)).
- Termo armazenado por versão (`v1.0-2026-05-24` em [lib/lgpd.ts](lib/lgpd.ts)).
- Registro de `paciente_id`, `versao_termo`, `aceito_em`, `ip` e `user_agent` em `consentimentos_lgpd`.
- Base legal: tutela da saúde (LGPD Art. 11, II, "f"). Política completa em `/politica-lgpd`.

## Segurança

- Auth obrigatório para todo acesso a dados de paciente (middleware + RLS + checagem em rota).
- Service role key usada apenas server-side, isolada em [lib/supabase/admin.ts](lib/supabase/admin.ts).
- Callback de auth valida `next` (apenas caminhos relativos) — sem open redirect.
- CVV 188 sempre visível no rodapé via [CVVBanner](components/CVVBanner.tsx).

## GEO/SEO e PWA (Sprint 2)

- **Metadata por página** com Open Graph, Twitter card e canonical: layout global em [app/layout.tsx](app/layout.tsx); páginas individuais em `app/*/page.tsx`.
- **JSON-LD**: `MedicalOrganization` + `WebSite` no layout, `FAQPage` na home. Componente reutilizável: [components/JsonLd.tsx](components/JsonLd.tsx) (escapa `</script>` de forma segura).
- **Descoberta**: [app/sitemap.ts](app/sitemap.ts) → `/sitemap.xml`; [app/robots.ts](app/robots.ts) → `/robots.txt` (bloqueia `/api/`, `/pacientes/`, `/profissionais/`).
- **Para IA**: [public/llms.txt](public/llms.txt) descrevendo a plataforma, restrições clínicas e o CVV 188.
- **PWA**: [app/manifest.ts](app/manifest.ts) → `/manifest.webmanifest`, ícones SVG em [public/icon.svg](public/icon.svg) e [public/icon-maskable.svg](public/icon-maskable.svg). Ícone do navegador em [app/icon.svg](app/icon.svg).
- **Viewport e tema**: `themeColor` e `viewportFit: cover` em [app/layout.tsx](app/layout.tsx).

> Para deploy em produção, defina `NEXT_PUBLIC_APP_URL` com a URL absoluta — é usada por `metadataBase`, sitemap e JSON-LD.

## Testes (Sprint 2)

Vitest configurado em [vitest.config.ts](vitest.config.ts). Suítes:

- [tests/validators.test.ts](tests/validators.test.ts) — UF, telefone BR, CRP/CRM, consentimento LGPD.
- [tests/mappers.test.ts](tests/mappers.test.ts) — `snake_case` ↔ `camelCase` de pacientes/triagens/profissionais.
- [tests/seo.test.ts](tests/seo.test.ts) — `getSiteUrl`, `absoluteUrl`.

A CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) roda `lint` → `typecheck` → `test` → `build` a cada PR.

## Chat de acolhimento (Sprint 3)

Página pública em [`/acolhimento`](app/acolhimento/page.tsx) com chat conduzido por IA (Groq):

- **System prompt clínico** ([lib/groq/prompt.ts](lib/groq/prompt.ts)) — proíbe diagnóstico DSM-5/CID e prescrição; obriga acionamento do CVV 188 em risco.
- **Interceptação semântica determinística** ([lib/groq/risco.ts](lib/groq/risco.ts)) — varredura por padrões inequívocos de risco antes de qualquer chamada ao LLM. Se detectado, devolve mensagem de emergência sem gastar tokens. Coberto por [tests/risco.test.ts](tests/risco.test.ts).
- **Function calling** ([lib/groq/tools.ts](lib/groq/tools.ts)) — quando a IA julga ter contexto suficiente, chama `finalizar_triagem_e_encaminhar`. O front mostra o resumo e pede dados mínimos + consentimento LGPD.
- **Persistência atômica** em [`/api/acolhimento/concluir`](app/api/acolhimento/concluir/route.ts) — cria paciente + consentimento + triagem em sequência com rollback do paciente em caso de falha do consentimento.

Sem `GROQ_API_KEY` definida, a rota `/api/acolhimento/chat` responde 500. O resto do app funciona normalmente.

## Diretório de serviços (Sprint 3 — versão mínima)

[`/diretorio`](app/diretorio/page.tsx) lê de [data/diretorio.json](data/diretorio.json) e filtra por UF. Lista inicial curada com CAPS e clínicas-escola, mais links para fontes oficiais. Em sprint futuro, migrar para Sanity CMS preservando a interface de [lib/diretorio.ts](lib/diretorio.ts).

## Painel do profissional (Sprint 3.5)

[`/painel`](app/painel/page.tsx) (rota protegida) mostra:

- **Meus casos** — triagens que o profissional logado assumiu.
- **Fila de novos casos** — triagens sem `profissional_id`, priorizadas por `sinal_de_alerta` e data.
- **Outros profissionais** — somente visível para admin.

Ações disponíveis:

- **Assumir** caso novo → seta `profissional_id` e muda status para `em_atendimento`. Reforçado por uma checagem de race condition (409 se outro profissional pegou primeiro).
- **Marcar encaminhado** e **Encerrar** mudam o `status` da triagem.

Status possíveis: `novo`, `em_atendimento`, `encaminhado`, `encerrado`.

### Cal.com

Profissional pode preencher `calLink` (qualquer URL `https://cal.com/...`) em [/profissionais/novo](app/profissionais/novo/page.tsx). Quando uma triagem é atribuída, o detalhe do paciente em [/pacientes/[id]](app/pacientes/[id]/page.tsx) mostra um botão "Agendar atendimento pelo Cal.com" apontando para essa URL.

## Roadmap

- [x] **Sprint 1** — Segurança + Supabase + LGPD + CVV global
- [x] **Sprint 2** — GEO/SEO (metadata, JSON-LD, sitemap, robots, llms.txt), PWA (manifest + ícones SVG), testes unitários
- [x] **Sprint 3** — Chat Groq + system prompt clínico + interceptação semântica, diretório mínimo
- [x] **Sprint 3.5** — Painel profissional, status de atendimento, Cal.com link por profissional
- [x] **Sprint 4** — Certificação de voluntariado, adapter Sanity (stub), observability mínima, Stripe Freemium skeleton, Cloudflare Pages prep

## Certificação de voluntariado (Sprint 4)

Em [`/painel/certificado`](app/painel/certificado/page.tsx), o profissional vê um certificado pronto para imprimir/salvar como PDF (`window.print()` com CSS `@media print`).

**Heurística de horas** ([lib/certificado.ts](lib/certificado.ts)):

- Cada triagem `encaminhada` ou `encerrada` conta `HORAS_POR_TRIAGEM = 1,5h`.
- Casos prioritários (`sinalDeAlerta=true`) recebem `BONUS_PRIORITARIO = 0,5h`.
- **Básico** a partir de 10h; **Avançado** a partir de 40h.

Quando integrarmos o Cal.com via API (Sprint futuro), substituir a heurística pela soma real de eventos realizados.

## Diretório com adapter (Sprint 4)

[`lib/diretorio/`](lib/diretorio/) virou pasta com dispatcher por env var:

```bash
DIRETORIO_PROVIDER=json    # default — usa data/diretorio.json
DIRETORIO_PROVIDER=sanity  # usa @sanity (precisa SANITY_PROJECT_ID etc.)
```

Stub Sanity em [lib/diretorio/sanity.ts](lib/diretorio/sanity.ts) já implementa o fetch GROQ-like; basta criar dois schemas no Sanity (`servicoSaudeMental`, `fonteDiretorio`) e definir as env vars. Nada na UI muda.

## Observability (Sprint 4)

[`lib/observability.ts`](lib/observability.ts) emite JSON estruturado em stdout (formato amigável para Cloudflare Logs, Vercel Logs, Datadog, Axiom).

- `logInfo(msg, context?)` / `logWarn(msg, context?)`
- `captureError(err, context?)` — serializa qualquer valor como erro

Para upgrade ao Sentry: instale `@sentry/nextjs`, troque a função `emit` para chamar também `Sentry.captureException`. Sem alteração de API.

## Freemium Stripe (Sprint 4 — skeleton)

[`/painel/assinatura`](app/painel/assinatura/page.tsx) mostra o status atual do profissional, lido de `public.assinaturas_profissionais`. Sem `STRIPE_SECRET_KEY` configurada, a página exibe "Pagamentos ainda não foram ativados" e o botão de contratar não aparece.

**Para ativar:**
1. `npm install stripe`
2. Definir `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` no `.env.local`
3. Substituir os stubs em [lib/stripe.ts](lib/stripe.ts) por chamadas reais ao SDK
4. Configurar webhook no painel Stripe → `https://seu-host/api/stripe/webhook`

## Deploy Cloudflare Pages (Sprint 4 — prep)

Renomeie [wrangler.toml.example](wrangler.toml.example) para `wrangler.toml`, ajuste os valores e:

```bash
npx wrangler pages deploy .vercel/output/static   # após `next build`
```

Ou conecte o repositório direto no Cloudflare Pages e use a build do Next nativa.

## Próximos passos

- [ ] Integrar Sanity real (substituindo o stub) — sem mudança na UI.
- [ ] Habilitar pagamentos Stripe (instalar SDK + trocar stubs).
- [ ] Adicionar Sentry/Logflare em produção (upgrade da camada `lib/observability.ts`).
- [ ] Testes E2E (Playwright) cobrindo o fluxo público.
- [ ] Auth do paciente + linkagem `pacientes.user_id` (atualmente dormente).

## Como contribuir

1. Crie uma branch a partir de `main`.
2. Faça commits pequenos e objetivos.
3. Abra um Pull Request com descrição clara. CI roda lint + typecheck + build automaticamente.

## Licença

MIT.
