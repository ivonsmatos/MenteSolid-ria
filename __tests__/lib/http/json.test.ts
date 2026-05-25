import { describe, expect, it } from 'vitest';
import { respostaErro } from '@/lib/http/json';

describe('http/json respostaErro', () => {
  it('retorna payload com error/details e compatibilidade com erro/detalhes', async () => {
    const response = respostaErro(400, 'Falha de validação', { campo: ['Obrigatório'] });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: 'Falha de validação',
      details: { campo: ['Obrigatório'] },
      erro: 'Falha de validação',
      detalhes: { campo: ['Obrigatório'] }
    });
  });

  it('omite details/detalhes quando não enviados', async () => {
    const response = respostaErro(500, 'Erro interno');
    const payload = await response.json();

    expect(payload).toEqual({
      error: 'Erro interno',
      erro: 'Erro interno'
    });
  });
});
