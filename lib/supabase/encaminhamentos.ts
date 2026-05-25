import { supabaseClient } from '@/lib/supabase/client';

export interface EncaminhamentoSupabase {
  id?: string;
  paciente_id: string;
  profissional_origem_id?: string;
  profissional_destino_id?: string;
  resumo_clinico?: string;
  status?: string;
  created_at?: string;
}

export async function criarEncaminhamento(
  dados: EncaminhamentoSupabase
): Promise<EncaminhamentoSupabase> {
  const { data, error } = await supabaseClient
    .from('encaminhamentos')
    .insert(dados)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as EncaminhamentoSupabase;
}

export async function listarEncaminhamentos(
  profissionalId: string
): Promise<EncaminhamentoSupabase[]> {
  const { data, error } = await supabaseClient
    .from('encaminhamentos')
    .select('*')
    .eq('profissional_destino_id', profissionalId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as EncaminhamentoSupabase[];
}

export async function atualizarStatus(
  id: string,
  status: string
): Promise<EncaminhamentoSupabase | null> {
  const { data, error } = await supabaseClient
    .from('encaminhamentos')
    .update({ status })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as EncaminhamentoSupabase | null) ?? null;
}
