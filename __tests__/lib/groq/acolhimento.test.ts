import { describe, expect, it, vi } from 'vitest';
import { gerarRespostaAcolhimento } from '@/lib/groq/acolhimento';
import { groqClient } from '@/lib/groq/client';

describe('groq/acolhimento', () => {
  it('deve detectar alerta CVV quando há risco explícito', async () => {
    vi.stubEnv('GROQ_API_KEY', 'fake-key');
    vi.mocked(groqClient.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: 'Procure ajuda imediata e ligue para 188.' } }]
    } as never);

    const resultado = await gerarRespostaAcolhimento('Estou pensando em me matar', []);
    expect(resultado.alertaCVV).toBe(true);
    expect(resultado.dadosTriagem.alertaCVV188).toBe(true);
  });

  it('deve manter formato de resposta estruturado', async () => {
    vi.unstubAllEnvs();
    const resultado = await gerarRespostaAcolhimento('Estou ansioso', []);
    expect(typeof resultado.resposta).toBe('string');
    expect(typeof resultado.alertaCVV).toBe('boolean');
    expect(resultado.dadosTriagem).toBeDefined();
  });
});
