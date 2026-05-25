import { beforeEach, describe, expect, it, vi } from 'vitest';
import { atualizarPaciente, buscarPaciente, criarPaciente, listarPacientes } from '@/lib/supabase/pacientes';
import { supabaseClient } from '@/lib/supabase/client';

const fromMock = vi.mocked(supabaseClient.from as unknown as ReturnType<typeof vi.fn>);

describe('supabase/pacientes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar paciente com sucesso', async () => {
    const single = vi.fn().mockResolvedValue({ data: { id: '1', nome: 'Ana' }, error: null });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    fromMock.mockReturnValue({ insert } as unknown as ReturnType<typeof fromMock>);

    const data = await criarPaciente({ nome: 'Ana' });
    expect(data.id).toBe('1');
  });

  it('deve buscar paciente por id', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { id: '2', nome: 'Bia' }, error: null });
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    fromMock.mockReturnValue({ select } as unknown as ReturnType<typeof fromMock>);

    const data = await buscarPaciente('2');
    expect(data?.nome).toBe('Bia');
  });

  it('deve listar pacientes com paginação', async () => {
    const query = {
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: [{ id: '1' }], error: null })
    };
    fromMock.mockReturnValue({ select: vi.fn(() => query) } as unknown as ReturnType<typeof fromMock>);

    const data = await listarPacientes({ page: 1, perPage: 10 });
    expect(data).toHaveLength(1);
  });

  it('deve propagar erro de RLS ao atualizar', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'new row violates row-level security policy' }
    });
    const select = vi.fn(() => ({ maybeSingle }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    fromMock.mockReturnValue({ update } as unknown as ReturnType<typeof fromMock>);

    await expect(atualizarPaciente('x', { nome: 'Teste' })).rejects.toBeTruthy();
  });
});
