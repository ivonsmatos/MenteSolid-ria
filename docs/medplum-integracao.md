# Integração Medplum no MenteSolidária

## Por que Medplum nesta arquitetura

O Medplum foi escolhido como camada de dados clínicos por ser FHIR-nativo, com foco em segurança e interoperabilidade para aplicações de saúde. Isso reduz acoplamento com modelos proprietários e facilita evolução para compliance em ambientes regulados.

No contexto do MenteSolidária, ele complementa o MVP atual baseado em `data/db.json` sem substituir a persistência local existente, permitindo evolução incremental com menor risco operacional.

## Variáveis de ambiente necessárias

Configure as variáveis abaixo no ambiente do Next.js:

```bash
NEXT_PUBLIC_MEDPLUM_BASE_URL=https://api.medplum.com/
MEDPLUM_CLIENT_ID=seu_client_id
MEDPLUM_CLIENT_SECRET=seu_client_secret
```

- `NEXT_PUBLIC_MEDPLUM_BASE_URL`: endpoint base da instância Medplum (cloud/sandbox ou self-hosted).
- `MEDPLUM_CLIENT_ID` e `MEDPLUM_CLIENT_SECRET`: credenciais para fluxo de client credentials nas rotas server-side.

## Recursos FHIR mapeados

- **Patient**: cadastro demográfico com CPF em `identifier` e extensão de vulnerabilidade socioeconômica.
- **Encounter**: registro da triagem inicial com prioridade clínica.
- **Observation**: sinal clínico de alerta com mapeamento para risco de suicídio (LOINC).
- **ServiceRequest**: encaminhamento para especialidade de saúde mental.
- **DocumentReference**: resumo clínico do encaminhamento com confidencialidade restrita (`R`).

## Como rodar localmente com Medplum cloud/sandbox

1. Crie credenciais de aplicação no Medplum (cloud ou sandbox).
2. Defina as variáveis de ambiente em `.env.local`.
3. Instale dependências e rode a aplicação:

```bash
npm install
npm run dev
```

4. Teste as novas rotas:
   - `POST /api/fhir/patient`
   - `GET /api/fhir/patient?id=<id>`
   - `POST /api/fhir/encounter`

## Considerações LGPD específicas

- **Base legal de tratamento**: formalizar base legal para dados de saúde (inclusive quando houver tutela da saúde e proteção da vida).
- **Consentimento e transparência**: documentar consentimento informado e política de uso de dados sensíveis.
- **Minimização de dados**: coletar apenas campos necessários para triagem e encaminhamento.
- **Anonimização/pseudonimização**: adotar processos para dados usados em analytics e melhoria de produto.
- **Rastreabilidade de acesso**: manter trilhas de auditoria para operações clínicas.
- **Governança**: definir responsáveis internos (incluindo papel de encarregado/DPO) e rotinas de resposta a incidentes.
