import { describe, expect, it } from 'vitest';
import { lgpdConstantes, registrarConsentimento, verificarConsentimento } from '@/lib/lgpd/consentimento';

describe('lgpd/consentimento', () => {
  it('deve registrar consentimento com hash do IP', async () => {
    const pacienteId = 'paciente-teste';
    const ip = '127.0.0.1';

    const registro = await registrarConsentimento(pacienteId, ip);

    expect(registro.versao_termos).toBe('1.0');
    expect(registro.ip_hash).toHaveLength(64);
    expect(registro.ip_hash).toBe(lgpdConstantes.hashIp(ip));
  });

  it('deve validar consentimento pela versão atual dos termos', async () => {
    const pacienteId = 'paciente-versao';
    await registrarConsentimento(pacienteId, '10.0.0.1');

    const consentiu = await verificarConsentimento(pacienteId);
    expect(consentiu).toBe(true);
  });
});
