# Deploy no Cloudflare Pages + Workers

## Pré-requisitos

- Conta no Cloudflare com permissão para Pages e Workers.
- Node.js 20+.
- Dependências instaladas com `npm install`.
- Wrangler CLI disponível pelo projeto (`npx wrangler`) ou globalmente.

## Criar projeto no Cloudflare Pages

### Opção 1: Dashboard

1. Acesse **Workers & Pages** no painel Cloudflare.
2. Clique em **Create application** > **Pages**.
3. Selecione o repositório `ivonsmatos/MenteSolid-ria`.
4. Configure o build command como `npm run pages:build`.
5. Configure o output directory como `.vercel/output/static`.

### Opção 2: CLI

```bash
npx wrangler pages project create mentesolidaria
```

## Variáveis de ambiente necessárias

Configure no Dashboard do Cloudflare (Pages > Settings > Environment variables) e também como secrets no GitHub:

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

## Criar e vincular banco D1

1. Criar banco:

```bash
npx wrangler d1 create mentesolidaria
```

2. Copiar `database_id` retornado e atualizar `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "mentesolidaria"
database_id = "seu-database-id"
```

3. Aplicar migrations quando necessário:

```bash
npx wrangler d1 migrations apply mentesolidaria
```

## Criar e vincular KV para cache

1. Criar namespace:

```bash
npx wrangler kv namespace create CACHE_KV
```

2. Copiar o `id` e configurar:
   - `CLOUDFLARE_KV_NAMESPACE_ID` nas variáveis de ambiente.
   - binding `CACHE_KV` no projeto Pages/Workers.

## Primeiro deploy manual

```bash
npm run deploy
```

Deploy de preview manual:

```bash
npm run deploy:preview
```

## Deploy automático com GitHub Actions

O workflow `.github/workflows/deploy-cloudflare.yml` faz:

- `test`: executa `npm run test`.
- `build`: executa `npm run pages:build`.
- `deploy-preview`: deploy para PR em branch `pr-<numero-do-pr>`.
- `deploy-production`: deploy para `main`.

Secrets obrigatórios no GitHub:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- todas as variáveis da seção anterior.

## Domínio customizado

1. No projeto Pages, abra **Custom domains**.
2. Clique em **Set up a custom domain**.
3. Informe o domínio/subdomínio.
4. Confirme os registros DNS sugeridos pelo Cloudflare.

## Limitações do runtime edge

- Nem toda API Node.js está disponível no edge.
- Rotas que usam `fs`, sockets diretos ou bibliotecas exclusivamente Node devem permanecer fora de edge runtime.
- Nunca cachear dados clínicos ou PII em Cache API/KV.
