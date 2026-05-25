import crypto from 'crypto';
import { supabaseClient } from '@/lib/supabase/client';

const ENCRYPTION_SECRET = process.env.NEXTAUTH_SECRET ?? 'mentesolidaria-default-secret';

export interface PacienteSupabase {
  id?: string;
  nome: string;
  cpf?: string;
  data_nascimento?: string;
  telefone?: string;
  email?: string;
  genero?: string;
  vulnerabilidade_socioeconomica?: boolean;
  profissional_id?: string;
}

export interface ListaPacientesParams {
  profissionalId?: string;
  page?: number;
  perPage?: number;
}

function criptografarCPF(cpf?: string): string | undefined {
  if (!cpf) {
    return undefined;
  }

  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(cpf, 'utf8'), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function descriptografarCPF(cpf?: string): string | undefined {
  if (!cpf || !cpf.includes(':')) {
    return cpf;
  }

  const [ivHex, encryptedHex] = cpf.split(':');
  if (!ivHex || !encryptedHex) {
    return undefined;
  }

  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const key = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString('utf8');
}

function normalizarPaciente<T extends { cpf?: string }>(paciente: T): T {
  let cpfDescriptografado: string | undefined;
  try {
    cpfDescriptografado = descriptografarCPF(paciente.cpf);
  } catch {
    cpfDescriptografado = undefined;
  }

  return {
    ...paciente,
    cpf: cpfDescriptografado
  };
}

export async function criarPaciente(dados: PacienteSupabase): Promise<PacienteSupabase> {
  const payload = {
    ...dados,
    cpf: criptografarCPF(dados.cpf)
  };

  const { data, error } = await supabaseClient.from('pacientes').insert(payload).select('*').single();

  if (error) {
    throw error;
  }

  return normalizarPaciente(data as PacienteSupabase);
}

export async function buscarPaciente(id: string): Promise<PacienteSupabase | null> {
  const { data, error } = await supabaseClient
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return normalizarPaciente(data as PacienteSupabase);
}

export async function listarPacientes({
  profissionalId,
  page = 1,
  perPage = 10
}: ListaPacientesParams = {}): Promise<PacienteSupabase[]> {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  let query = supabaseClient
    .from('pacientes')
    .select('*')
    .order('created_at', { ascending: false })
    .range(start, end);

  if (profissionalId) {
    query = query.eq('profissional_id', profissionalId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((paciente: unknown) =>
    normalizarPaciente(paciente as PacienteSupabase)
  );
}

export async function atualizarPaciente(
  id: string,
  dados: Partial<PacienteSupabase>
): Promise<PacienteSupabase | null> {
  const payload = {
    ...dados,
    ...(dados.cpf ? { cpf: criptografarCPF(dados.cpf) } : {})
  };

  const { data, error } = await supabaseClient
    .from('pacientes')
    .update(payload)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return normalizarPaciente(data as PacienteSupabase);
}
