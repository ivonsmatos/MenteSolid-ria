# Arquitetura do Software — MenteSolidária (MVP)

## 1. Arquitetura escolhida
Aplicação monolítica em Next.js (App Router), com páginas e API Routes no mesmo projeto para acelerar entrega do MVP.

## 2. Estrutura de arquivos
```text
mentesolidaria/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── pacientes/
│   │   ├── page.tsx
│   │   ├── novo/page.tsx
│   │   └── [id]/page.tsx
│   ├── profissionais/
│   │   ├── page.tsx
│   │   └── novo/page.tsx
│   └── api/
│       ├── pacientes/route.ts
│       ├── pacientes/[id]/route.ts
│       └── profissionais/route.ts
├── components/
│   ├── PacienteForm.tsx
│   ├── ProfissionalForm.tsx
│   ├── TriagemForm.tsx
│   └── AlertaPrioridade.tsx
├── lib/
│   ├── db.ts
│   ├── validators.ts
│   └── groq-tools.ts
├── types/
│   └── index.ts
├── docs/
│   ├── requisitos.md
│   └── arquitetura.md
├── data/
│   └── db.json
└── README.md
```

## 3. Bibliotecas utilizadas
- Next.js + React + TypeScript para UI e rotas.
- Tailwind CSS para estilização.
- React Hook Form + Zod para validação de formulários.
- `uuid` para IDs únicos.
- `lucide-react` para ícones.

## 4. Armazenamento de dados
- MVP usa `data/db.json` como persistência local.
- Leitura/escrita feita em `lib/db.ts` via `fs/promises` com caminho absoluto baseado em `process.cwd()`.
- Estrutura de dados preparada para futura migração para Supabase.

## 5. Fluxo da aplicação
1. Usuário acessa páginas de pacientes/profissionais.
2. Formulários enviam dados para API Routes (`POST`).
3. API valida com Zod e aplica regras de negócio (ex.: email único de paciente).
4. Camada `lib/db.ts` persiste dados em `data/db.json`.
5. Tela de detalhe de paciente salva triagem (`PATCH`) e exibe alerta visual para casos prioritários.
