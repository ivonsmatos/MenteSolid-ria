# Compliance LGPD — MenteSolidária

## Bases legais

O MenteSolidária utiliza, principalmente, as seguintes bases legais:

- **Art. 7º, IX** — tutela da saúde em procedimento realizado por profissionais da área da saúde.
- **Art. 11º, II, "f"** — garantia da prevenção à fraude e da segurança do titular em processos que envolvem dados sensíveis, com medidas técnicas e administrativas adequadas.

## Fluxo de consentimento

1. Paciente inicia cadastro.
2. Modal LGPD exige leitura dos termos (scroll obrigatório) e dupla confirmação.
3. O sistema registra consentimento em `consentimentos_lgpd` com:
   - `paciente_id`
   - `versao_termos` (`1.0`)
   - `aceito_em`
   - `ip_hash` (SHA-256)
4. O consentimento pode ser validado por versão antes de operações sensíveis.

## Direitos do titular implementados

- Confirmação da existência de tratamento.
- Acesso a informações de tratamento vinculadas ao paciente.
- Correção e atualização de dados cadastrais.
- Registro de trilha de auditoria para accountability.

## Política de retenção de dados

- Dados clínicos e de triagem são mantidos pelo período necessário para continuidade do cuidado.
- Logs de auditoria são retidos para rastreabilidade e conformidade legal.
- Dados podem ser anonimizados/excluídos mediante solicitação válida do titular, observadas obrigações legais de retenção.
