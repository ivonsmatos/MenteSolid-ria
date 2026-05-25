import { afterEach, describe, expect, it, vi } from 'vitest';

describe('app/api/pacientes POST', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('não consulta pacientes locais quando USE_SUPABASE=true', async () => {
    const getPacientes = vi.fn().mockResolvedValue([
      {
        id: 'local-1',
        nome: 'Paciente Local',
        email: 'local@example.com',
        telefone: '11999999999',
        cidade: 'São Paulo',
        estado: 'SP',
        dataNascimento: '2000-01-01',
        genero: 'feminino'
      }
    ]);
    const createPaciente = vi.fn();
    const criarPaciente = vi.fn().mockResolvedValue({
      id: 'supabase-1'
    });

    vi.doMock('@/lib/env', () => ({ USE_SUPABASE: true }));
    vi.doMock('@/lib/db', () => ({ getPacientes, createPaciente }));
    vi.doMock('@/lib/supabase/pacientes', () => ({
      criarPaciente,
      listarPacientes: vi.fn()
    }));

    const { POST } = await import('@/app/api/pacientes/route');
    const request = new Request('http://localhost/api/pacientes', {
      method: 'POST',
      body: JSON.stringify({
        nome: 'Paciente Supabase',
        email: 'supabase@example.com',
        telefone: '11988887777',
        cidade: 'São Paulo',
        estado: 'SP',
        dataNascimento: '1995-05-10',
        genero: 'feminino'
      })
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(getPacientes).not.toHaveBeenCalled();
    expect(criarPaciente).toHaveBeenCalledTimes(1);
  });
});
