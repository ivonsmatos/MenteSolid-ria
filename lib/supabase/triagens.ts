import { supabaseClient } from '@/lib/supabase/client';

export interface TriagemSupabase {
  id?: string;
  paciente_id: string;
  profissional_id: string;
  nivel_prioridade: string;
  alerta_cvv?: boolean;
  sintomas?: string[];
  observacoes?: string;
  created_at?: string;
}

export async function criarTriagem(dados: TriagemSupabase): Promise<TriagemSupabase> {
  const { data, error } = await supabaseClient.from('triagens').insert(dados).select('*').single();

  if (error) {
    throw error;
  }

  return data as TriagemSupabase;
}

export async function buscarTriagem(id: string): Promise<TriagemSupabase | null> {
  const { data, error } = await supabaseClient
    .from('triagens')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as TriagemSupabase | null) ?? null;
}

export async function listarTriagens(profissionalId: string): Promise<TriagemSupabase[]> {
  const { data, error } = await supabaseClient
    .from('triagens')
    .select('*')
    .eq('profissional_id', profissionalId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as TriagemSupabase[];
}
