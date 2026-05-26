import { describe, expect, it } from 'vitest';
import { detectarRisco, MENSAGEM_EMERGENCIA_CVV } from '@/lib/groq/risco';

describe('detectarRisco — positivos (devem disparar CVV)', () => {
  it.each([
    'estou pensando em suicídio',
    'quero me matar',
    'quero matar-me',
    'tirar minha vida',
    'pensei em tirar a minha vida',
    'acabar com tudo',
    'quero acabar comigo',
    'acabar com a minha vida',
    'não aguento mais',
    'não aguento mais viver',
    'não aguento continuar',
    'estou pensando em automutilação',
    'me cortar quando estou triste',
    'quero morrer',
    'quero desaparecer',
    'quero sumir',
    'não quero mais viver',
    'não quero viver',
    'me sinto sem saída',
    'não vejo saída',
    'tenho plano de suicídio',
    'SUICIDIO'
  ])('detecta risco em "%s"', (texto) => {
    expect(detectarRisco(texto).risco).toBe(true);
  });
});

describe('detectarRisco — negativos (não devem disparar)', () => {
  it.each([
    'estou um pouco triste',
    'tenho dificuldade pra dormir',
    'minha cabeça anda confusa',
    'ando ansiosa antes das provas',
    'estou cansado do trabalho',
    'preciso conversar com alguém',
    'queria ter mais tempo pra mim',
    'sinto saudade da minha família'
  ])('NÃO detecta risco em "%s"', (texto) => {
    expect(detectarRisco(texto).risco).toBe(false);
  });
});

describe('detectarRisco — formato do retorno', () => {
  it('inclui padraoMatched quando há risco', () => {
    const d = detectarRisco('quero me matar');
    expect(d.risco).toBe(true);
    expect(typeof d.padraoMatched).toBe('string');
    expect((d.padraoMatched ?? '').length).toBeGreaterThan(0);
  });

  it('não retorna padraoMatched quando não há risco', () => {
    const d = detectarRisco('estou bem hoje');
    expect(d.risco).toBe(false);
    expect(d.padraoMatched).toBeUndefined();
  });
});

describe('MENSAGEM_EMERGENCIA_CVV', () => {
  it('menciona explicitamente CVV e 188', () => {
    expect(MENSAGEM_EMERGENCIA_CVV).toMatch(/CVV/);
    expect(MENSAGEM_EMERGENCIA_CVV).toMatch(/188/);
  });
});
