import crypto from 'crypto';
import { USE_SUPABASE } from '@/lib/env';
import { supabaseAdmin } from '@/lib/supabase/client';

const VERSAO_TERMOS_ATUAL = '1.0';
const consentimentosFallback = new Map<string, { versao_termos: string; ip_hash: string }>();

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function registrarConsentimento(pacienteId: string, ip: string) {
  const ipHash = hashIp(ip);

  if (!USE_SUPABASE) {
    const registro = {
      versao_termos: VERSAO_TERMOS_ATUAL,
      ip_hash: ipHash
    };
    consentimentosFallback.set(pacienteId, registro);
    return registro;
  }

  const payload = {
    paciente_id: pacienteId,
    versao_termos: VERSAO_TERMOS_ATUAL,
    aceito_em: new Date().toISOString(),
    ip_hash: ipHash
  };

  const { data, error } = await supabaseAdmin
    .from('consentimentos_lgpd')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function verificarConsentimento(pacienteId: string): Promise<boolean> {
  if (!USE_SUPABASE) {
    const consentimento = consentimentosFallback.get(pacienteId);
    return consentimento?.versao_termos === VERSAO_TERMOS_ATUAL;
  }

  const { data, error } = await supabaseAdmin
    .from('consentimentos_lgpd')
    .select('id,versao_termos')
    .eq('paciente_id', pacienteId)
    .eq('versao_termos', VERSAO_TERMOS_ATUAL)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data?.id);
}

export const lgpdConstantes = {
  VERSAO_TERMOS_ATUAL,
  hashIp
};
