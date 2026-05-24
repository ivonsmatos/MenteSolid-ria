import { NextResponse } from 'next/server';
import { getPacienteById, updatePacienteTriagem } from '@/lib/db';
import { triagemSchema } from '@/lib/validators';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;
  const paciente = await getPacienteById(id);

  if (!paciente) {
    return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(paciente);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();
  const parsed = triagemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados de triagem inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await updatePacienteTriagem(id, parsed.data);

  if (!updated) {
    return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
