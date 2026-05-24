import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Paciente, Profissional, TriagemEncaminhamento } from '@/types';
import { PacienteInput, ProfissionalInput, TriagemInput } from '@/lib/validators';

interface Database {
  pacientes: Paciente[];
  profissionais: Profissional[];
}

const dbPath = path.join(process.cwd(), 'data', 'db.json');

async function readDb(): Promise<Database> {
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw) as Database;
}

async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function getPacientes(): Promise<Paciente[]> {
  const db = await readDb();
  return db.pacientes;
}

export async function getPacienteById(id: string): Promise<Paciente | undefined> {
  const db = await readDb();
  return db.pacientes.find((paciente) => paciente.id === id);
}

export async function createPaciente(data: PacienteInput): Promise<Paciente> {
  const db = await readDb();
  const paciente: Paciente = {
    ...data,
    id: uuidv4(),
    criadoEm: new Date().toISOString()
  };

  db.pacientes.push(paciente);
  await writeDb(db);

  return paciente;
}

export async function updatePacienteTriagem(
  id: string,
  triagem: TriagemInput
): Promise<Paciente | undefined> {
  const db = await readDb();
  const index = db.pacientes.findIndex((paciente) => paciente.id === id);

  if (index === -1) {
    return undefined;
  }

  const triagemData: TriagemEncaminhamento = {
    ...triagem,
    criadoEm: new Date().toISOString()
  };

  db.pacientes[index] = {
    ...db.pacientes[index],
    triagem: triagemData
  };

  await writeDb(db);
  return db.pacientes[index];
}

export async function getProfissionais(): Promise<Profissional[]> {
  const db = await readDb();
  return db.profissionais;
}

export async function createProfissional(data: ProfissionalInput): Promise<Profissional> {
  const db = await readDb();
  const profissional: Profissional = {
    ...data,
    id: uuidv4(),
    ativo: data.ativo ?? true,
    criadoEm: new Date().toISOString()
  };

  db.profissionais.push(profissional);
  await writeDb(db);

  return profissional;
}
