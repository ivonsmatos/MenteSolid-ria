export const triagemTool = {
  name: 'finalizar_triagem_e_encaminhar',
  description: 'Gera um resumo estruturado da conversa de acolhimento.',
  parameters: {
    type: 'object',
    properties: {
      motivo_da_busca: { type: 'string' },
      sintomas_relatados: { type: 'array', items: { type: 'string' } },
      tempo_de_queixa: { type: 'string' },
      impacto_na_rotina: { type: 'string' },
      perfil_indicado: { type: 'string', enum: ['psicologia', 'psiquiatria', 'indefinido'] },
      sinal_de_alerta: { type: 'boolean' },
      resumo_clinico_para_especialista: { type: 'string' }
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
} as const;
