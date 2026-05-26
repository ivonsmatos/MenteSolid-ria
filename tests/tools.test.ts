import { describe, expect, it } from 'vitest';
import { parseTriagemArgs } from '@/lib/groq/tools';

const valido = {
  motivo_da_busca: 'Ansiedade frequente',
  sintomas_relatados: ['insônia', 'irritabilidade'],
  tempo_de_queixa: '3 meses',
  impacto_na_rotina: 'Dificuldade no trabalho',
  perfil_indicado: 'psicologia',
  sinal_de_alerta: false,
  resumo_clinico_para_especialista: 'Encaminhar para psicoterapia breve.'
};

describe('parseTriagemArgs', () => {
  it('aceita payload bem formado', () => {
    const out = parseTriagemArgs(JSON.stringify(valido));
    expect(out).not.toBeNull();
    expect(out?.perfil_indicado).toBe('psicologia');
  });

  it('rejeita perfil fora do enum', () => {
    const out = parseTriagemArgs(JSON.stringify({ ...valido, perfil_indicado: 'cardiologia' }));
    expect(out).toBeNull();
  });

  it('rejeita campos faltando', () => {
    const semSintomas: Record<string, unknown> = { ...valido };
    delete semSintomas.sintomas_relatados;
    expect(parseTriagemArgs(JSON.stringify(semSintomas))).toBeNull();
  });

  it('rejeita JSON inválido', () => {
    expect(parseTriagemArgs('not json')).toBeNull();
  });

  it('rejeita sinal_de_alerta não-booleano', () => {
    expect(parseTriagemArgs(JSON.stringify({ ...valido, sinal_de_alerta: 'sim' }))).toBeNull();
  });
});
