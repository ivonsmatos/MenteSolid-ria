# 🧠 MenteSolidária

Base inicial do PWA MenteSolidária, otimizada para **Cloudflare Pages + Workers** com Next.js App Router.

## Stack

- Next.js 15 + TypeScript estrito
- Tailwind CSS + componentes UI estilo Shadcn
- Cloudflare Pages (`@cloudflare/next-on-pages` + Wrangler)
- Groq API (rota `/api/chat` em edge runtime)
- Supabase client-side
- Vitest

## Scripts

```bash
npm run dev            # Next local
npm run dev:cf         # Cloudflare Pages local (Wrangler)
npm run build          # Build Next
npm run pages:build    # Build para Cloudflare Pages
npm run deploy         # Deploy produção
npm run deploy:preview # Deploy preview
npm run lint
npm run test -- --run
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha as chaves.
