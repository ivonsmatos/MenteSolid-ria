import {
  emailAlertaCVV,
  emailConfirmacaoPaciente,
  emailNovoEncaminhamento
} from '@/lib/notificacoes/email';
import { notificarProfissional } from '@/lib/notificacoes/whatsapp';
import { respostaErro } from '@/lib/http/json';

type TipoNotificacao = 'novo_encaminhamento' | 'confirmacao_agendamento' | 'alerta_cvv';

export const runtime = 'edge';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      tipo?: TipoNotificacao;
      payload?: Record<string, unknown>;
    };

    if (!body.tipo || !body.payload) {
      return respostaErro(400, 'Campos obrigatórios: tipo e payload.');
    }

    if (body.tipo === 'novo_encaminhamento') {
      await emailNovoEncaminhamento(
        {
          nome: String(body.payload.profissionalNome ?? 'Profissional'),
          email: String(body.payload.profissionalEmail ?? '')
        },
        {
          nome: String(body.payload.pacienteNome ?? 'Paciente'),
          email: String(body.payload.pacienteEmail ?? '')
        },
        String(body.payload.resumo ?? '')
      );

      if (body.payload.profissionalTelefone) {
        await notificarProfissional(
          {
            nome: String(body.payload.profissionalNome ?? 'Profissional'),
            telefone: String(body.payload.profissionalTelefone)
          },
          {
            resumo_clinico: String(body.payload.resumo ?? '')
          }
        );
      }

      return Response.json({ ok: true });
    }

    if (body.tipo === 'confirmacao_agendamento') {
      await emailConfirmacaoPaciente(
        {
          nome: String(body.payload.pacienteNome ?? 'Paciente'),
          email: String(body.payload.pacienteEmail ?? '')
        },
        {
          nome: String(body.payload.profissionalNome ?? 'Profissional'),
          email: String(body.payload.profissionalEmail ?? '')
        },
        String(body.payload.dataAgendamento ?? '')
      );

      return Response.json({ ok: true });
    }

    if (body.tipo === 'alerta_cvv') {
      await emailAlertaCVV(
        {
          nome: String(body.payload.adminNome ?? 'Admin'),
          email: String(body.payload.adminEmail ?? '')
        },
        {
          nome: String(body.payload.pacienteNome ?? 'Paciente'),
          email: String(body.payload.pacienteEmail ?? '')
        }
      );

      return Response.json({ ok: true });
    }

    return respostaErro(400, 'Tipo de notificação inválido.');
  } catch {
    return respostaErro(500, 'Falha ao processar notificação.');
  }
}
