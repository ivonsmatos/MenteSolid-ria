import { NextResponse } from 'next/server';
import { createProfissional, getProfissionais } from '@/lib/db';
import { profissionalSchema } from '@/lib/validators';

export async function GET() {
  const profissionais = await getProfissionais();
  return NextResponse.json(profissionais);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = profissionalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const profissional = await createProfissional(parsed.data);
  return NextResponse.json(profissional, { status: 201 });
}
