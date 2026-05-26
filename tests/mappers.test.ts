import { describe, expect, it } from 'vitest';
import {
  pacienteFromRow,
  profissionalFromRow,
  triagemFromRow
} from '@/lib/mappers';

const triagemRow = {
  id: 't1',
  paciente_id: 'p1',
  profissional_id: null,
  motivo_da_busca: 'Ansiedade',
  sintomas_relatados: ['a', 'b'],
  tempo_de_queixa: '3 meses',
  impacto_na_rotina: 'Alto',
  perfil_indicado: 'psicologia',
  sinal_de_alerta: false,
  resumo_clinico: 'Encaminhar.',
  criado_em: '2026-05-24T00:00:00Z',
  atualizado_em: '2026-05-24T00:00:00Z'
};

const pacienteRow = {
  id: 'p1',
  user_id: null,
  nome: 'Maria',
  email: 'maria@example.com',
  telefone: '11999999999',
  cidade: 'SP',
  uf: 'SP',
  data_nascimento: '1990-01-01',
  genero: 'feminino',
  como_chegou: 'Indicação',
  criado_em: '2026-05-24T00:00:00Z'
};

const profissionalRow = {
  id: 'pr1',
  user_id: 'u1',
  nome: 'Dra Joana',
  email: 'joana@example.com',
  telefone: '11999999999',
  cidade: 'SP',
  uf: 'SP',
  especialidade: 'psicologia',
  numero_registro: 'CRP 06/123456',
  ativo: true,
  criado_em: '2026-05-24T00:00:00Z'
};

describe('triagemFromRow', () => {
  it('mapeia snake_case para camelCase preservando array de sintomas', () => {
    const t = triagemFromRow(triagemRow);
    expect(t.pacienteId).toBe('p1');
    expect(t.motivoDaBusca).toBe('Ansiedade');
    expect(t.sintomasRelatados).toEqual(['a', 'b']);
    expect(t.perfilIndicado).toBe('psicologia');
    expect(t.sinalDeAlerta).toBe(false);
    expect(t.resumoClinicoParaEspecialista).toBe('Encaminhar.');
  });
});

describe('pacienteFromRow', () => {
  it('mapeia campos e ignora triagem se não fornecida', () => {
    const p = pacienteFromRow(pacienteRow);
    expect(p.nome).toBe('Maria');
    expect(p.uf).toBe('SP');
    expect(p.triagem).toBeNull();
  });

  it('inclui triagem quando passada', () => {
    const p = pacienteFromRow(pacienteRow, triagemRow);
    expect(p.triagem?.motivoDaBusca).toBe('Ansiedade');
  });
});

describe('profissionalFromRow', () => {
  it('mapeia campos do profissional', () => {
    const pr = profissionalFromRow(profissionalRow);
    expect(pr.nome).toBe('Dra Joana');
    expect(pr.numeroRegistro).toBe('CRP 06/123456');
    expect(pr.especialidade).toBe('psicologia');
    expect(pr.ativo).toBe(true);
  });
});
