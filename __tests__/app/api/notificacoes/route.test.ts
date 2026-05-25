import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/config', () => ({
  getServerSession: vi.fn()
}));

vi.mock('@/lib/auth/guards', () => ({
  requireAuth: vi.fn()
}));

vi.mock('@/lib/notificacoes/email', () => ({
  emailAlertaCVV: vi.fn(),
  emailConfirmacaoPaciente: vi.fn(),
  emailNovoEncaminhamento: vi.fn()
}));

vi.mock('@/lib/notificacoes/whatsapp', () => ({
  notificarProfissional: vi.fn()
}));

import { getServerSession } from '@/lib/auth/config';
import { requireAuth } from '@/lib/auth/guards';
import { emailConfirmacaoPaciente } from '@/lib/notificacoes/email';
import { POST } from '@/app/api/notificacoes/route';

describe('POST /api/notificacoes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 para usuário não autenticado', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null as never);
    vi.mocked(requireAuth).mockImplementation(() => {
      throw new Error('Usuário não autenticado.');
    });

    const response = await POST(
      new Request('http://localhost/api/notificacoes', {
        method: 'POST',
        body: JSON.stringify({
          tipo: 'confirmacao_agendamento',
          payload: {}
        })
      })
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ erro: 'Usuário não autenticado.' });
  });

  it('deve processar notificação quando usuário está autenticado', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'profissional@mentesolidaria.org' }
    } as never);
    vi.mocked(requireAuth).mockImplementation(() => undefined);

    const response = await POST(
      new Request('http://localhost/api/notificacoes', {
        method: 'POST',
        body: JSON.stringify({
          tipo: 'confirmacao_agendamento',
          payload: {
            pacienteNome: 'Paciente',
            pacienteEmail: 'paciente@teste.com',
            profissionalNome: 'Profissional',
            profissionalEmail: 'profissional@teste.com',
            dataAgendamento: '2026-06-01T10:00:00Z'
          }
        })
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(emailConfirmacaoPaciente).toHaveBeenCalledOnce();
  });
});
