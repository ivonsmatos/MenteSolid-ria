import { NextResponse } from 'next/server';
import { getPacienteById, updatePacienteTriagem } from '@/lib/db';
import { triagemSchema } from '@/lib/validators';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const paciente = await getPacienteById(params.id);

  if (!paciente) {
    return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(paciente);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = triagemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados de triagem inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await updatePacienteTriagem(params.id, parsed.data);

  if (!updated) {
    return NextResponse.json({ error: 'Paciente não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
