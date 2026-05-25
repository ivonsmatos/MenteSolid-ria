import { supabaseClient } from '@/lib/supabase/client';

export interface ProfissionalSupabase {
  id?: string;
  nome: string;
  crp_crm: string;
  especialidade: string;
  email: string;
  disponivel?: boolean;
}

export async function listarProfissionais(): Promise<ProfissionalSupabase[]> {
  const { data, error } = await supabaseClient
    .from('profissionais')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProfissionalSupabase[];
}

export async function criarProfissional(dados: ProfissionalSupabase): Promise<ProfissionalSupabase> {
  const { data, error } = await supabaseClient
    .from('profissionais')
    .insert(dados)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as ProfissionalSupabase;
}
