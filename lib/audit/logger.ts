import { USE_SUPABASE } from '@/lib/env';
import { supabaseAdmin } from '@/lib/supabase/client';

interface RegistroAcessoParams {
  userId?: string;
  acao: string;
  recurso: string;
  recursoId?: string;
  dadosAnteriores?: unknown;
}

const fallbackAudit: Array<RegistroAcessoParams & { created_at: string }> = [];

export async function registrarAcesso(params: RegistroAcessoParams): Promise<void> {
  const payload = {
    user_id: params.userId,
    acao: params.acao,
    recurso: params.recurso,
    recurso_id: params.recursoId,
    dados_anteriores: params.dadosAnteriores ?? null
  };

  if (!USE_SUPABASE) {
    fallbackAudit.push({ ...params, created_at: new Date().toISOString() });
    return;
  }

  await supabaseAdmin.from('audit_log').insert(payload);
}

export async function listarAcessos(recursoId: string, recurso: string) {
  if (!USE_SUPABASE) {
    return fallbackAudit.filter((item) => item.recursoId === recursoId && item.recurso === recurso);
  }

  const { data, error } = await supabaseAdmin
    .from('audit_log')
    .select('*')
    .eq('recurso_id', recursoId)
    .eq('recurso', recurso)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
