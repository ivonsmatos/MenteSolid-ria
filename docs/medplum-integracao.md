# Integração Medplum no MenteSolidária

## Por que Medplum nesta arquitetura

O Medplum atua como **camada de dados clínicos FHIR-nativa** complementar ao banco operacional (Supabase). Isso preserva interoperabilidade com sistemas de saúde, mantém o vocabulário clínico padronizado (LOINC, SNOMED, HL7 v3) e reduz acoplamento com modelos proprietários.

No MenteSolidária, Medplum é **aditivo**: os dados primários ficam em Supabase Postgres (`pacientes`, `triagens`, `consentimentos_lgpd`), e o Medplum recebe espelhamentos clínicos (`Patient`, `Encounter`, `Observation`, `ServiceRequest`, `DocumentReference`) para casos em que a interoperabilidade FHIR é necessária.

## Variáveis de ambiente

Configure em `.env.local` (ver [.env.example](../.env.example)):

```bash
NEXT_PUBLIC_MEDPLUM_BASE_URL=https://api.medplum.com/
MEDPLUM_CLIENT_ID=seu_client_id
MEDPLUM_CLIENT_SECRET=seu_client_secret
```

## Recursos FHIR mapeados

- **Patient** ([lib/medplum/patient.ts](../lib/medplum/patient.ts)): cadastro demográfico com CPF em `identifier` e extensão de vulnerabilidade socioeconômica.
- **Encounter** ([lib/medplum/encounter.ts](../lib/medplum/encounter.ts)): registro da triagem inicial com prioridade clínica (v3-ActPriority).
- **Observation** (mesmo arquivo): sinal clínico de alerta com LOINC `69730-0` (Suicide risk [Reported]).
- **ServiceRequest** ([lib/medplum/referral.ts](../lib/medplum/referral.ts)): encaminhamento (SNOMED `306206005`) para psicologia/psiquiatria.
- **DocumentReference** (mesmo arquivo): resumo clínico com `securityLabel = R` (Restricted).

## Como rodar localmente

1. Crie credenciais de aplicação no Medplum (cloud ou sandbox).
2. Defina as variáveis em `.env.local`.
3. Instale dependências e rode a aplicação:

```bash
npm install
npm run dev
```

4. Teste as rotas autenticadas (login como `profissional`/`admin`):
   - `POST /api/fhir/patient`
   - `GET  /api/fhir/patient?id=<id>`
   - `POST /api/fhir/encounter`

> ⚠️ Todas as rotas `/api/fhir/*` exigem autenticação com papel `profissional` ou `admin`. O middleware bloqueia acessos anônimos.

## Considerações LGPD específicas

- **Base legal de tratamento:** tutela da saúde e proteção da vida (LGPD Art. 11, II, "f"). O consentimento explícito do paciente é capturado em `consentimentos_lgpd` antes de qualquer registro clínico no Medplum.
- **Minimização de dados:** envie ao Medplum apenas campos necessários para interoperabilidade clínica (não duplique dados administrativos puros).
- **Anonimização/pseudonimização:** ao usar dados FHIR para analytics, remova identifiers (CPF, telecom) usando `DocumentReference` separados.
- **Rastreabilidade:** o audit log do Supabase (`audit_log`) já cobre as ações na camada operacional; para auditoria FHIR, habilite `AuditEvent` no Medplum em Sprint futuro.
- **Governança:** definir DPO/encarregado e rotinas de incidente é tarefa institucional (fora do código).
