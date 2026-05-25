import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Paciente, Profissional, TriagemEncaminhamento } from '@/types';
import { PacienteInput, ProfissionalInput, TriagemInput } from '@/lib/validators';

interface Database {
  pacientes: Paciente[];
  profissionais: Profissional[];
  triagens?: TriagemDb[];
  encaminhamentos?: EncaminhamentoDb[];
}

export interface TriagemDb {
  id: string;
  paciente_id: string;
  profissional_id: string;
  nivel_prioridade: string;
  alerta_cvv: boolean;
  sintomas: string[];
  observacoes?: string;
  created_at: string;
}

export interface EncaminhamentoDb {
  id: string;
  paciente_id: string;
  profissional_origem_id?: string;
  profissional_destino_id?: string;
  resumo_clinico?: string;
  status: string;
  created_at: string;
}

const dbPath = path.join(process.cwd(), 'data', 'db.json');

async function readDb(): Promise<Database> {
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw) as Database;
}

async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function ensureCollections(db: Database): Required<Database> {
  return {
    ...db,
    triagens: db.triagens ?? [],
    encaminhamentos: db.encaminhamentos ?? []
  };
}

export async function getPacientes(): Promise<Paciente[]> {
  const db = ensureCollections(await readDb());
  return db.pacientes;
}

export async function getPacienteById(id: string): Promise<Paciente | undefined> {
  const db = ensureCollections(await readDb());
  return db.pacientes.find((paciente) => paciente.id === id);
}

export async function createPaciente(data: PacienteInput): Promise<Paciente> {
  const db = ensureCollections(await readDb());
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
  const db = ensureCollections(await readDb());
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
  const db = ensureCollections(await readDb());
  return db.profissionais;
}

export async function createProfissional(data: ProfissionalInput): Promise<Profissional> {
  const db = ensureCollections(await readDb());
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

export async function createTriagemDb(
  data: Omit<TriagemDb, 'id' | 'created_at'>
): Promise<TriagemDb> {
  const db = ensureCollections(await readDb());
  const triagem: TriagemDb = {
    ...data,
    id: uuidv4(),
    created_at: new Date().toISOString()
  };

  db.triagens.push(triagem);
  await writeDb(db);
  return triagem;
}

export async function getTriagemByIdDb(id: string): Promise<TriagemDb | undefined> {
  const db = ensureCollections(await readDb());
  return db.triagens.find((triagem) => triagem.id === id);
}

export async function listTriagensByProfissionalDb(profissionalId: string): Promise<TriagemDb[]> {
  const db = ensureCollections(await readDb());
  return db.triagens
    .filter((triagem) => triagem.profissional_id === profissionalId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createEncaminhamentoDb(
  data: Omit<EncaminhamentoDb, 'id' | 'created_at' | 'status'> & { status?: string }
): Promise<EncaminhamentoDb> {
  const db = ensureCollections(await readDb());
  const encaminhamento: EncaminhamentoDb = {
    ...data,
    status: data.status ?? 'pendente',
    id: uuidv4(),
    created_at: new Date().toISOString()
  };

  db.encaminhamentos.push(encaminhamento);
  await writeDb(db);
  return encaminhamento;
}

export async function listEncaminhamentosByDestinoDb(
  profissionalId: string
): Promise<EncaminhamentoDb[]> {
  const db = ensureCollections(await readDb());
  return db.encaminhamentos
    .filter((encaminhamento) => encaminhamento.profissional_destino_id === profissionalId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateEncaminhamentoStatusDb(
  id: string,
  status: string
): Promise<EncaminhamentoDb | undefined> {
  const db = ensureCollections(await readDb());
  const index = db.encaminhamentos.findIndex((encaminhamento) => encaminhamento.id === id);
  if (index < 0) {
    return undefined;
  }

  db.encaminhamentos[index] = {
    ...db.encaminhamentos[index],
    status
  };

  await writeDb(db);
  return db.encaminhamentos[index];
}
