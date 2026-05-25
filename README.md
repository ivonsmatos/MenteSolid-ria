# 🧠 MenteSolidária

Plataforma digital de impacto social para conectar pessoas em vulnerabilidade socioeconômica a acolhimento inicial e encaminhamento para profissionais voluntários de saúde mental.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-RLS-3ECF8E)
![NextAuth](https://img.shields.io/badge/NextAuth-JWT-purple)
![Groq](https://img.shields.io/badge/Groq-llama3--70b-ff4f00)
![Cal.com](https://img.shields.io/badge/Cal.com-v2-111827)
![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18)
![Medplum FHIR](https://img.shields.io/badge/Medplum-FHIR-5A2DFF)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages%20%2B%20Workers-F38020)

## Stack tecnológica

- [Next.js 15](https://nextjs.org/) + App Router
- [TypeScript](https://www.typescriptlang.org/) estrito
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Supabase](https://supabase.com/) com RLS + fallback em `data/db.json`
- [NextAuth.js](https://next-auth.js.org/) com JWT
- [Groq](https://groq.com/) para acolhimento assistido por IA
- [Cal.com](https://cal.com/) para agendamento
- [Medplum](https://www.medplum.com/) para camada clínica FHIR
- [Vitest](https://vitest.dev/) para testes unitários

## Instalação

```bash
git clone https://github.com/ivonsmatos/MenteSolid-ria.git
cd MenteSolid-ria
npm install
npm run dev
```

## Variáveis de ambiente

Use `.env.example` como base:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GROQ_API_KEY=
CALCOM_API_KEY=
CALCOM_BASE_URL=
RESEND_API_KEY=
WHATSAPP_API_URL=
WHATSAPP_API_KEY=
NEXT_PUBLIC_MEDPLUM_BASE_URL=
MEDPLUM_CLIENT_ID=
MEDPLUM_CLIENT_SECRET=
USE_SUPABASE=false
```

## Scripts

```bash
npm run dev
npm run build
npm run test
npm run test:ui
npm run test:coverage
npm run pages:build
npm run deploy
```

## Deploy

Deploy oficial em Cloudflare Pages + Workers:

```bash
npm run pages:build
npm run deploy
```

Workflow de CI/CD: `.github/workflows/deploy-cloudflare.yml`.
Guia completo: `docs/deploy-cloudflare.md`.

## Roadmap

- [x] Migração inicial para Supabase com fallback local
- [x] Autenticação com NextAuth (Credentials + Google opcional)
- [x] Consentimento LGPD explícito com versionamento
- [x] Camada FHIR com Medplum
- [x] Endpoints de acolhimento (Groq) e agendamento (Cal.com)
- [x] Notificações internas (email + WhatsApp)
- [x] Dashboard profissional inicial
- [x] Audit log de acesso
- [x] Base de testes com Vitest
- [x] Deploy em Cloudflare Pages + Workers
- [ ] Evoluir cobertura de testes E2E e hardening de produção

## Documentação adicional

- `docs/arquitetura.md`
- `docs/medplum-integracao.md`
- `docs/lgpd-compliance.md`
- `docs/deploy-cloudflare.md`
