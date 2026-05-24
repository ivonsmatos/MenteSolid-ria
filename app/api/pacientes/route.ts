import { NextResponse } from 'next/server';
import { createPaciente, getPacientes } from '@/lib/db';
import { pacienteSchema } from '@/lib/validators';

export async function GET() {
  const pacientes = await getPacientes();
  return NextResponse.json(pacientes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = pacienteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const pacientes = await getPacientes();
  const emailExists = pacientes.some(
    (paciente) => paciente.email.toLowerCase() === parsed.data.email.toLowerCase()
  );

  if (emailExists) {
    return NextResponse.json({ error: 'E-mail já cadastrado para outro paciente.' }, { status: 409 });
  }

  const novoPaciente = await createPaciente(parsed.data);
  return NextResponse.json(novoPaciente, { status: 201 });
}
