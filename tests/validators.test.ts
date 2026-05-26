import { describe, expect, it } from 'vitest';
import {
  pacienteSchema,
  pacientePublicoCadastroSchema,
  profissionalSchema,
  triagemSchema,
  ufSchema
} from '@/lib/validators';

describe('ufSchema', () => {
  it.each(['SP', 'RJ', 'MG', 'DF', 'AC', 'TO'])('aceita UF %s', (uf) => {
    expect(ufSchema.safeParse(uf).success).toBe(true);
  });

  it.each(['XX', 'sp', '', 'SPP', 'BR'])('rejeita UF inválida "%s"', (uf) => {
    expect(ufSchema.safeParse(uf).success).toBe(false);
  });
});

describe('pacienteSchema', () => {
  const base = {
    nome: 'Maria',
    email: 'maria@example.com',
    telefone: '(11) 99999-9999',
    cidade: 'São Paulo',
    uf: 'SP'
  };

  it('aceita dados mínimos válidos', () => {
    expect(pacienteSchema.safeParse(base).success).toBe(true);
  });

  it('normaliza email para minúsculas', () => {
    const parsed = pacienteSchema.safeParse({ ...base, email: 'MARIA@Example.COM' });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe('maria@example.com');
  });

  it.each([
    '11999999999',
    '(11)999999999',
    '11 99999-9999',
    '(11) 9999-9999'
  ])('aceita telefone BR "%s"', (telefone) => {
    expect(pacienteSchema.safeParse({ ...base, telefone }).success).toBe(true);
  });

  it.each(['abc', '123', '+55 (11) 99999-9999 ext'])('rejeita telefone inválido "%s"', (telefone) => {
    expect(pacienteSchema.safeParse({ ...base, telefone }).success).toBe(false);
  });

  it('rejeita data de nascimento em formato errado', () => {
    expect(
      pacienteSchema.safeParse({ ...base, dataNascimento: '01/01/1990' }).success
    ).toBe(false);
  });

  it('aceita data de nascimento ISO ou vazia', () => {
    expect(
      pacienteSchema.safeParse({ ...base, dataNascimento: '1990-01-01' }).success
    ).toBe(true);
    expect(
      pacienteSchema.safeParse({ ...base, dataNascimento: '' }).success
    ).toBe(true);
  });

  it('rejeita UF inválida', () => {
    expect(pacienteSchema.safeParse({ ...base, uf: 'ZZ' }).success).toBe(false);
  });
});

describe('pacientePublicoCadastroSchema', () => {
  const base = {
    nome: 'Maria',
    email: 'maria@example.com',
    telefone: '11999999999',
    cidade: 'São Paulo',
    uf: 'SP',
    consentimentoLgpd: true
  };

  it('exige consentimentoLgpd = true', () => {
    expect(pacientePublicoCadastroSchema.safeParse(base).success).toBe(true);
    expect(
      pacientePublicoCadastroSchema.safeParse({ ...base, consentimentoLgpd: false }).success
    ).toBe(false);
    const { consentimentoLgpd: _drop, ...semConsent } = base;
    expect(pacientePublicoCadastroSchema.safeParse(semConsent).success).toBe(false);
  });
});

describe('profissionalSchema', () => {
  const base = {
    nome: 'Dra Joana',
    email: 'joana@example.com',
    telefone: '11999999999',
    cidade: 'São Paulo',
    uf: 'SP',
    especialidade: 'psicologia' as const,
    numeroRegistro: 'CRP 06/123456'
  };

  it('aceita CRP no formato brasileiro', () => {
    expect(profissionalSchema.safeParse(base).success).toBe(true);
  });

  it.each([
    'CRM/SP 123456',
    'CRM/SP123456',
    'crp 06/12345'
  ])('aceita registro "%s"', (numeroRegistro) => {
    expect(profissionalSchema.safeParse({ ...base, numeroRegistro }).success).toBe(true);
  });

  it.each([
    'ABC 123',
    'CRP06',
    '123456',
    'OAB/SP 123'
  ])('rejeita registro inválido "%s"', (numeroRegistro) => {
    expect(profissionalSchema.safeParse({ ...base, numeroRegistro }).success).toBe(false);
  });

  it('rejeita especialidade fora do enum', () => {
    expect(
      profissionalSchema.safeParse({ ...base, especialidade: 'odontologia' }).success
    ).toBe(false);
  });
});

describe('triagemSchema', () => {
  const base = {
    motivoDaBusca: 'Ansiedade frequente',
    sintomasRelatados: ['insônia', 'desânimo'],
    tempoDeQueixa: '3 meses',
    impactoNaRotina: 'Dificuldade no trabalho',
    perfilIndicado: 'psicologia' as const,
    sinalDeAlerta: false,
    resumoClinicoParaEspecialista: 'Encaminhar para psicoterapia.'
  };

  it('aceita triagem válida', () => {
    expect(triagemSchema.safeParse(base).success).toBe(true);
  });

  it('exige ao menos um sintoma', () => {
    expect(triagemSchema.safeParse({ ...base, sintomasRelatados: [] }).success).toBe(false);
  });

  it('exige perfil indicado dentro do enum', () => {
    expect(
      triagemSchema.safeParse({ ...base, perfilIndicado: 'cardiologia' }).success
    ).toBe(false);
  });
});
