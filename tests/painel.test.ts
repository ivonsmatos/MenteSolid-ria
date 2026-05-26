import { describe, expect, it } from 'vitest';
import {
  atualizarTriagemSchema,
  calLinkSchema,
  triagemStatusSchema
} from '@/lib/validators';
import { painelCasoFromRow, profissionalFromRow } from '@/lib/mappers';

describe('triagemStatusSchema', () => {
  it.each(['novo', 'em_atendimento', 'encaminhado', 'encerrado'])(
    'aceita status "%s"',
    (s) => {
      expect(triagemStatusSchema.safeParse(s).success).toBe(true);
    }
  );

  it.each(['pendente', 'arquivado', 'NOVO', ''])('rejeita status inválido "%s"', (s) => {
    expect(triagemStatusSchema.safeParse(s).success).toBe(false);
  });
});

describe('calLinkSchema', () => {
  it.each([
    'https://cal.com/joana',
    'https://www.cal.com/joana',
    'http://cal.com/joana/15min'
  ])('aceita "%s"', (url) => {
    expect(calLinkSchema.safeParse(url).success).toBe(true);
  });

  it.each([
    'https://example.com/joana',
    'cal.com/joana',
    'https://calendly.com/joana'
  ])('rejeita "%s"', (url) => {
    expect(calLinkSchema.safeParse(url).success).toBe(false);
  });

  it('aceita string vazia (normaliza para undefined)', () => {
    const parsed = calLinkSchema.safeParse('');
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data).toBeUndefined();
  });
});

describe('atualizarTriagemSchema', () => {
  it('aceita só status', () => {
    expect(atualizarTriagemSchema.safeParse({ status: 'encerrado' }).success).toBe(true);
  });

  it('aceita só claim=true', () => {
    expect(atualizarTriagemSchema.safeParse({ claim: true }).success).toBe(true);
  });

  it('aceita claim + status juntos', () => {
    expect(
      atualizarTriagemSchema.safeParse({ claim: true, status: 'em_atendimento' }).success
    ).toBe(true);
  });

  it('rejeita payload vazio', () => {
    expect(atualizarTriagemSchema.safeParse({}).success).toBe(false);
  });

  it('rejeita claim=false sem status', () => {
    expect(atualizarTriagemSchema.safeParse({ claim: false }).success).toBe(false);
  });
});

describe('profissionalFromRow — cal_link', () => {
  const baseRow = {
    id: 'pr1',
    user_id: 'u1',
    nome: 'Joana',
    email: 'j@x.com',
    telefone: '11999999999',
    cidade: 'SP',
    uf: 'SP',
    especialidade: 'psicologia',
    numero_registro: 'CRP 06/123456',
    ativo: true,
    criado_em: '2026-05-24T00:00:00Z'
  };

  it('mapeia cal_link quando presente', () => {
    const p = profissionalFromRow({ ...baseRow, cal_link: 'https://cal.com/joana' });
    expect(p.calLink).toBe('https://cal.com/joana');
  });

  it('mapeia cal_link como null quando ausente', () => {
    const p = profissionalFromRow(baseRow);
    expect(p.calLink).toBeNull();
  });
});

describe('painelCasoFromRow', () => {
  it('mapeia view v_painel_casos para PainelCaso', () => {
    const caso = painelCasoFromRow({
      triagem_id: 't1',
      status: 'novo',
      sinal_de_alerta: true,
      perfil_indicado: 'psicologia',
      criado_em: '2026-05-24T00:00:00Z',
      atualizado_em: '2026-05-24T00:00:00Z',
      profissional_id: null,
      paciente_id: 'p1',
      paciente_nome: 'Maria',
      paciente_cidade: 'São Paulo',
      paciente_uf: 'SP'
    });
    expect(caso.triagemId).toBe('t1');
    expect(caso.status).toBe('novo');
    expect(caso.sinalDeAlerta).toBe(true);
    expect(caso.pacienteUf).toBe('SP');
    expect(caso.profissionalId).toBeNull();
  });
});
