import { describe, expect, it } from 'vitest';
import {
  calcularHoras,
  nivelCertificado,
  HORAS_POR_TRIAGEM,
  BONUS_PRIORITARIO,
  HORAS_PARA_CERTIFICADO_BASICO,
  HORAS_PARA_CERTIFICADO_AVANCADO
} from '@/lib/certificado';

describe('calcularHoras', () => {
  it('retorna zero para lista vazia', () => {
    const r = calcularHoras([]);
    expect(r.totalHoras).toBe(0);
    expect(r.totalCasos).toBe(0);
    expect(r.encerrados).toBe(0);
    expect(r.prioritarios).toBe(0);
  });

  it('ignora casos novos e em atendimento', () => {
    const r = calcularHoras([
      { status: 'novo', sinalDeAlerta: false },
      { status: 'em_atendimento', sinalDeAlerta: false }
    ]);
    expect(r.totalHoras).toBe(0);
    expect(r.totalCasos).toBe(2);
  });

  it('conta horas para encaminhado e encerrado', () => {
    const r = calcularHoras([
      { status: 'encaminhado', sinalDeAlerta: false },
      { status: 'encerrado', sinalDeAlerta: false }
    ]);
    expect(r.totalHoras).toBe(Math.round(HORAS_POR_TRIAGEM * 2 * 10) / 10);
    expect(r.encerrados).toBe(1);
  });

  it('adiciona bônus para casos prioritários', () => {
    const r = calcularHoras([
      { status: 'encerrado', sinalDeAlerta: true }
    ]);
    expect(r.totalHoras).toBe(
      Math.round((HORAS_POR_TRIAGEM + BONUS_PRIORITARIO) * 10) / 10
    );
    expect(r.prioritarios).toBe(1);
  });

  it('agrega corretamente porStatus', () => {
    const r = calcularHoras([
      { status: 'novo', sinalDeAlerta: false },
      { status: 'novo', sinalDeAlerta: false },
      { status: 'em_atendimento', sinalDeAlerta: false },
      { status: 'encerrado', sinalDeAlerta: false }
    ]);
    expect(r.porStatus.novo).toBe(2);
    expect(r.porStatus.em_atendimento).toBe(1);
    expect(r.porStatus.encerrado).toBe(1);
    expect(r.porStatus.encaminhado).toBe(0);
  });
});

describe('nivelCertificado', () => {
  it('retorna nenhum abaixo do básico', () => {
    expect(nivelCertificado(HORAS_PARA_CERTIFICADO_BASICO - 0.1)).toBe('nenhum');
  });

  it('retorna basico no limite exato', () => {
    expect(nivelCertificado(HORAS_PARA_CERTIFICADO_BASICO)).toBe('basico');
  });

  it('retorna basico até antes de avancado', () => {
    expect(nivelCertificado(HORAS_PARA_CERTIFICADO_AVANCADO - 0.1)).toBe('basico');
  });

  it('retorna avancado no limite exato', () => {
    expect(nivelCertificado(HORAS_PARA_CERTIFICADO_AVANCADO)).toBe('avancado');
  });
});
