# Deploy no Cloudflare Pages + Workers

Este guia descreve o deploy do MenteSolidária no Cloudflare Pages com Workers usando `@cloudflare/next-on-pages`.

## Pré-requisitos

- Conta Cloudflare ativa
- Projeto GitHub com acesso aos Secrets
- Node.js 20+
- Wrangler CLI disponível via `npx wrangler` ou instalação global

## Criar projeto no Cloudflare Pages

Você pode criar pelo dashboard ou pela CLI:

```bash
wrangler pages project create mentesolidaria
```

## Configurar variáveis de ambiente

No Cloudflare Dashboard, abra o projeto Pages e acesse:

`Settings > Environment Variables`

Cadastre todas as variáveis do `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GROQ_API_KEY`
- `CALCOM_API_KEY`
- `CALCOM_BASE_URL`
- `RESEND_API_KEY`
- `WHATSAPP_API_URL`
- `WHATSAPP_API_KEY`
- `NEXT_PUBLIC_MEDPLUM_BASE_URL`
- `MEDPLUM_CLIENT_ID`
- `MEDPLUM_CLIENT_SECRET`
- `USE_SUPABASE`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_KV_NAMESPACE_ID`

## Criar e vincular D1

Para criar o banco D1:

```bash
wrangler d1 create mentesolidaria
```

Depois, atualize `database_id` no `wrangler.toml`.

## Primeiro deploy manual

```bash
npm run pages:build
npm run deploy
```

## Domínio customizado

No Cloudflare Pages, acesse:

`Custom domains > Set up a custom domain`

Escolha o domínio/subdomínio e finalize o apontamento DNS conforme instruções da Cloudflare.

## Limitações do edge runtime

- Não usar `fs` em rotas edge
- Evitar APIs Node.js não compatíveis com Workers
- Preferir `fetch`, `Web Crypto` e APIs web nativas
- Nunca cachear dados clínicos ou PII no Cache API/KV
