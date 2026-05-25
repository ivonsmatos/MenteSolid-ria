import { describe, expect, it } from 'vitest';
import { toFhirEncounter, toFhirObservations } from '@/lib/medplum/encounter';

describe('medplum/encounter', () => {
  it('deve mapear prioridade e vínculos no Encounter', () => {
    const encounter = toFhirEncounter(
      {
        motivoDaBusca: 'Crise de ansiedade',
        sintomasRelatados: ['ansiedade'],
        tempoDeQueixa: '3 meses',
        impactoNaRotina: 'dificuldade para trabalhar',
        perfilIndicado: 'psicologia',
        resumoClinicoParaEspecialista: 'Resumo',
        prioridade: 'alta'
      },
      'patient-1',
      'professional-1'
    );

    expect(encounter.priority?.coding?.[0]?.code).toBe('A');
    expect(encounter.subject?.reference).toBe('Patient/patient-1');
    expect(encounter.participant?.[0]?.individual?.reference).toBe('Practitioner/professional-1');
  });

  it('deve gerar Observation com flag de CVV 188', () => {
    const observations = toFhirObservations({
      motivoDaBusca: 'Risco de vida',
      sintomasRelatados: ['ideação suicida'],
      tempoDeQueixa: '1 semana',
      impactoNaRotina: 'alto',
      perfilIndicado: 'indefinido',
      resumoClinicoParaEspecialista: 'Resumo',
      prioridade: 'urgente',
      alertaCVV188: true
    });

    expect(observations).toHaveLength(1);
    expect(observations[0].valueBoolean).toBe(true);
    expect(observations[0].code?.coding?.[0]?.system).toBe('http://loinc.org');
  });
});
