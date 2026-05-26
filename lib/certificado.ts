// Cálculo de horas voluntárias para certificação.
// Heurística MVP: cada triagem 'encerrada' equivale a HORAS_POR_TRIAGEM horas;
// triagens com sinal_de_alerta ganham bônus por exigirem mais cuidado.
// Quando houver integração com Cal.com (Sprint 4+), substituir pela soma real
// dos eventos agendados/realizados.

import type { TriagemStatus } from '@/types';

export const HORAS_POR_TRIAGEM = 1.5;
export const BONUS_PRIORITARIO = 0.5;

export interface HorasInput {
  status: TriagemStatus;
  sinalDeAlerta: boolean;
}

export interface ResumoHoras {
  totalHoras: number;
  totalCasos: number;
  encerrados: number;
  prioritarios: number;
  porStatus: Record<TriagemStatus, number>;
}

const STATUS_VAZIO: Record<TriagemStatus, number> = {
  novo: 0,
  em_atendimento: 0,
  encaminhado: 0,
  encerrado: 0
};

export function calcularHoras(triagens: HorasInput[]): ResumoHoras {
  const porStatus: Record<TriagemStatus, number> = { ...STATUS_VAZIO };
  let totalHoras = 0;
  let encerrados = 0;
  let prioritarios = 0;

  for (const t of triagens) {
    porStatus[t.status] = (porStatus[t.status] ?? 0) + 1;
    // Só conta horas para casos efetivamente atendidos.
    if (t.status === 'encaminhado' || t.status === 'encerrado') {
      totalHoras += HORAS_POR_TRIAGEM;
      if (t.sinalDeAlerta) {
        totalHoras += BONUS_PRIORITARIO;
        prioritarios += 1;
      }
    }
    if (t.status === 'encerrado') encerrados += 1;
  }

  return {
    totalHoras: Math.round(totalHoras * 10) / 10,
    totalCasos: triagens.length,
    encerrados,
    prioritarios,
    porStatus
  };
}

export const HORAS_PARA_CERTIFICADO_BASICO = 10;
export const HORAS_PARA_CERTIFICADO_AVANCADO = 40;

export function nivelCertificado(totalHoras: number): 'nenhum' | 'basico' | 'avancado' {
  if (totalHoras >= HORAS_PARA_CERTIFICADO_AVANCADO) return 'avancado';
  if (totalHoras >= HORAS_PARA_CERTIFICADO_BASICO) return 'basico';
  return 'nenhum';
}
