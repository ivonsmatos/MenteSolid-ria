import type { ChatTool } from './client';

export const TRIAGEM_TOOL: ChatTool = {
  type: 'function',
  function: {
    name: 'finalizar_triagem_e_encaminhar',
    description:
      'Conclui o acolhimento inicial gerando o resumo estruturado da conversa. Use quando tiver informações suficientes nos eixos: motivo, sintomas, tempo, impacto, perfil e risco.',
    parameters: {
      type: 'object',
      properties: {
        motivo_da_busca: {
          type: 'string',
          description: 'Por que a pessoa procurou ajuda agora.'
        },
        sintomas_relatados: {
          type: 'array',
          items: { type: 'string' },
          description: 'Sintomas/queixas em frases curtas.'
        },
        tempo_de_queixa: { type: 'string', description: 'Há quanto tempo ocorre.' },
        impacto_na_rotina: { type: 'string', description: 'Como afeta a vida diária.' },
        perfil_indicado: {
          type: 'string',
          enum: ['psicologia', 'psiquiatria', 'indefinido']
        },
        sinal_de_alerta: {
          type: 'boolean',
          description: 'true se houver QUALQUER indício de risco em qualquer momento.'
        },
        resumo_clinico_para_especialista: {
          type: 'string',
          description: 'Parágrafo objetivo para o profissional ler antes do primeiro atendimento.'
        }
      },
      required: [
        'motivo_da_busca',
        'sintomas_relatados',
        'tempo_de_queixa',
        'impacto_na_rotina',
        'perfil_indicado',
        'sinal_de_alerta',
        'resumo_clinico_para_especialista'
      ]
    }
  }
};

// Validação leve do payload retornado pela função.
export interface TriagemFunctionArgs {
  motivo_da_busca: string;
  sintomas_relatados: string[];
  tempo_de_queixa: string;
  impacto_na_rotina: string;
  perfil_indicado: 'psicologia' | 'psiquiatria' | 'indefinido';
  sinal_de_alerta: boolean;
  resumo_clinico_para_especialista: string;
}

export function parseTriagemArgs(raw: string): TriagemFunctionArgs | null {
  try {
    const parsed = JSON.parse(raw) as Partial<TriagemFunctionArgs>;
    if (
      typeof parsed.motivo_da_busca !== 'string' ||
      !Array.isArray(parsed.sintomas_relatados) ||
      typeof parsed.tempo_de_queixa !== 'string' ||
      typeof parsed.impacto_na_rotina !== 'string' ||
      typeof parsed.resumo_clinico_para_especialista !== 'string' ||
      !['psicologia', 'psiquiatria', 'indefinido'].includes(parsed.perfil_indicado as string) ||
      typeof parsed.sinal_de_alerta !== 'boolean'
    ) {
      return null;
    }
    return parsed as TriagemFunctionArgs;
  } catch {
    return null;
  }
}
