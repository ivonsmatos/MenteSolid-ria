import type { Patient } from '@medplum/fhirtypes';
import { ensureMedplumAuth, medplumClient } from '@/lib/medplum/client';
import { fromFhirPatient, toFhirPatient } from '@/lib/medplum/patient';
import type { LocalPatient } from '@/types/fhir';

function errorResponse(message: string, status: number, details?: unknown): Response {
  return Response.json(
    {
      error: message,
      details
    },
    { status }
  );
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return errorResponse('Parâmetro "id" é obrigatório.', 400);
  }

  try {
    await ensureMedplumAuth();
    const patient = await medplumClient.readResource('Patient', id);
    return Response.json(fromFhirPatient(patient));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao buscar paciente.';
    return errorResponse('Falha ao buscar Patient no Medplum.', 500, message);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const localPatient = (await request.json()) as LocalPatient;

    if (!localPatient?.nome) {
      return errorResponse('Campo "nome" é obrigatório para criar paciente.', 400);
    }

    await ensureMedplumAuth();
    const created = (await medplumClient.createResource(toFhirPatient(localPatient))) as Patient;

    return Response.json(fromFhirPatient(created), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao criar paciente.';
    return errorResponse('Falha ao criar Patient no Medplum.', 500, message);
  }
}
