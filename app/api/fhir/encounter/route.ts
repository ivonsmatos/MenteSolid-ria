import type { Encounter, Observation } from '@medplum/fhirtypes';
import { ensureMedplumAuth, medplumClient } from '@/lib/medplum/client';

export const runtime = 'edge';

import { toFhirEncounter, toFhirObservations } from '@/lib/medplum/encounter';
import { AuthError, requirePapel } from '@/lib/supabase/server';
import type { LocalTriagem } from '@/types/fhir';

interface EncounterPayload {
  triagem: LocalTriagem;
  patientId: string;
  professionalId: string;
}

function errorResponse(message: string, status: number, details?: unknown): Response {
  return Response.json({ error: message, details }, { status });
}

function authErrorToResponse(error: unknown): Response {
  if (error instanceof AuthError) return errorResponse(error.message, error.status);
  return errorResponse('Erro de autorização.', 500);
}

export async function POST(request: Request): Promise<Response> {
  try {
    await requirePapel('profissional', 'admin');
  } catch (e) {
    return authErrorToResponse(e);
  }

  try {
    const body = (await request.json()) as EncounterPayload;
    if (!body?.triagem || !body?.patientId || !body?.professionalId) {
      return errorResponse(
        'Body inválido. Envie "triagem", "patientId" e "professionalId".',
        400
      );
    }

    await ensureMedplumAuth();

    const encounterInput = toFhirEncounter(body.triagem, body.patientId, body.professionalId);
    const encounter = (await medplumClient.createResource(encounterInput)) as Encounter;

    const observationsInput = toFhirObservations(body.triagem).map((observation) => ({
      ...observation,
      subject: { reference: `Patient/${body.patientId}` },
      encounter: encounter.id ? { reference: `Encounter/${encounter.id}` } : undefined
    }));

    const observations = (await Promise.all(
      observationsInput.map((observation) => medplumClient.createResource(observation))
    )) as Observation[];

    return Response.json({ encounter, observations }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao registrar triagem.';
    return errorResponse('Falha ao criar Encounter/Observations no Medplum.', 500, message);
  }
}
