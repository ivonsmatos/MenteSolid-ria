import { describe, expect, it } from 'vitest';
import { jsonProvider } from '@/lib/diretorio/json';

describe('jsonProvider', () => {
  it('carrega serviços e fontes do JSON embutido', async () => {
    const dados = await jsonProvider.carregar();
    expect(Array.isArray(dados.servicos)).toBe(true);
    expect(Array.isArray(dados.fontes)).toBe(true);
    expect(dados.servicos.length).toBeGreaterThan(0);
  });

  it('todos os serviços têm campos obrigatórios', async () => {
    const dados = await jsonProvider.carregar();
    for (const s of dados.servicos) {
      expect(typeof s.id).toBe('string');
      expect(typeof s.nome).toBe('string');
      expect(typeof s.cidade).toBe('string');
      expect(typeof s.uf).toBe('string');
      expect(typeof s.telefone).toBe('string');
    }
  });
});
