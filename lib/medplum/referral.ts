import type { DocumentReference, ServiceRequest } from '@medplum/fhirtypes';
import type { LocalEncaminhamento, PrioridadeTriagem } from '@/types/fhir';

function prioridadeToServiceRequestPriority(
  prioridade: PrioridadeTriagem
): NonNullable<ServiceRequest['priority']> {
  const map = {
    baixa: 'routine',
    media: 'urgent',
    alta: 'asap',
    urgente: 'stat'
  } as const;

  return map[prioridade];
}

// Converte um encaminhamento local para ServiceRequest, preservando prioridade clínica.
export function toFhirServiceRequest(
  encaminhamento: LocalEncaminhamento,
  patientId: string,
  requesterId: string
): ServiceRequest {
  return {
    resourceType: 'ServiceRequest',
    status: 'active',
    intent: 'order',
    priority: prioridadeToServiceRequestPriority(encaminhamento.prioridade),
    subject: {
      reference: `Patient/${patientId}`
    },
    requester: {
      reference: `Practitioner/${requesterId}`
    },
    category: [
      {
        text: 'Encaminhamento em saúde mental'
      }
    ],
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '306206005',
          display: 'Referral to mental health service'
        }
      ],
      text: `Encaminhamento para ${encaminhamento.especialidadeDestino}`
    },
    note: [
      {
        text: encaminhamento.resumoClinico
      },
      ...(encaminhamento.observacoes
        ? [
            {
              text: encaminhamento.observacoes
            }
          ]
        : [])
    ]
  };
}

// Converte o resumo clínico para DocumentReference com rotulagem de confidencialidade restrita (R).
export function toFhirDocumentReference(resumo: string, patientId: string): DocumentReference {
  const encodedResumo = Buffer.from(resumo, 'utf-8').toString('base64');

  return {
    resourceType: 'DocumentReference',
    status: 'current',
    subject: {
      reference: `Patient/${patientId}`
    },
    type: {
      text: 'Resumo de encaminhamento clínico'
    },
    date: new Date().toISOString(),
    securityLabel: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality',
            code: 'R',
            display: 'Restricted'
          }
        ],
        text: 'Confidencialidade restrita'
      }
    ],
    content: [
      {
        attachment: {
          contentType: 'text/plain; charset=utf-8',
          data: encodedResumo,
          title: 'Resumo de Encaminhamento'
        }
      }
    ]
  };
}
