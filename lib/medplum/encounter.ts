import type { CodeableConcept, Encounter, Observation } from '@medplum/fhirtypes';
import type { LocalTriagem, PrioridadeTriagem } from '@/types/fhir';

function prioridadeToEncounter(prioridade: PrioridadeTriagem): CodeableConcept {
  const map = {
    baixa: { code: 'R', display: 'Rotina' },
    media: { code: 'UR', display: 'Urgente' },
    alta: { code: 'A', display: 'ASAP' },
    urgente: { code: 'EM', display: 'Emergência' }
  } as const;

  const selected = map[prioridade];

  return {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActPriority',
        code: selected.code,
        display: selected.display
      }
    ],
    text: selected.display
  };
}

// Converte a triagem local para um Encounter FHIR com vínculo de paciente e profissional.
export function toFhirEncounter(
  triagem: LocalTriagem,
  patientId: string,
  professionalId: string
): Encounter {
  return {
    resourceType: 'Encounter',
    status: 'finished',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory'
    },
    priority: prioridadeToEncounter(triagem.prioridade),
    subject: {
      reference: `Patient/${patientId}`
    },
    participant: [
      {
        individual: {
          reference: `Practitioner/${professionalId}`
        }
      }
    ],
    reasonCode: [
      {
        text: triagem.motivoDaBusca
      }
    ],
    period: {
      start: triagem.criadoEm ?? new Date().toISOString()
    }
  };
}

// Mapeia sinais da triagem em Observations, incluindo risco de suicídio (CVV 188) por LOINC.
export function toFhirObservations(triagem: LocalTriagem): Observation[] {
  const alertaCVV = triagem.alertaCVV188 ?? triagem.sinalDeAlerta ?? false;

  return [
    {
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '69730-0',
            display: 'Suicide risk [Reported]'
          }
        ],
        text: 'Risco de suicídio'
      },
      valueBoolean: alertaCVV,
      interpretation: alertaCVV
        ? [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                  code: 'H',
                  display: 'High'
                }
              ]
            }
          ]
        : undefined,
      note: [
        {
          text: `Triagem inicial com recomendação ${
            alertaCVV ? 'de orientação imediata ao CVV 188.' : 'sem indicação imediata ao CVV 188.'
          }`
        }
      ],
      effectiveDateTime: triagem.criadoEm ?? new Date().toISOString()
    }
  ];
}
