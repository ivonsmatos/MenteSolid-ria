import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder');
const fromEmail = 'noreply@mentesolidaria.local';

interface ProfissionalEmail {
  nome: string;
  email: string;
}

interface PacienteEmail {
  nome: string;
  email: string;
}

export async function emailNovoEncaminhamento(
  profissional: ProfissionalEmail,
  paciente: PacienteEmail,
  resumo: string
) {
  return resend.emails.send({
    from: fromEmail,
    to: profissional.email,
    subject: 'Novo encaminhamento recebido',
    html: `<p>Olá, ${profissional.nome}.</p><p>Você recebeu um novo encaminhamento de ${paciente.nome}.</p><p><strong>Resumo:</strong> ${resumo}</p>`
  });
}

export async function emailConfirmacaoPaciente(
  paciente: PacienteEmail,
  profissional: ProfissionalEmail,
  dataAgendamento: string
) {
  return resend.emails.send({
    from: fromEmail,
    to: paciente.email,
    subject: 'Agendamento confirmado',
    html: `<p>Olá, ${paciente.nome}.</p><p>Seu atendimento com ${profissional.nome} foi confirmado para ${dataAgendamento}.</p>`
  });
}

export async function emailAlertaCVV(admin: { email: string; nome: string }, paciente: PacienteEmail) {
  return resend.emails.send({
    from: fromEmail,
    to: admin.email,
    subject: 'Alerta crítico CVV',
    html: `<p>Olá, ${admin.nome}.</p><p>Foi identificado um caso com possível risco de vida para o paciente ${paciente.nome}. Revisar imediatamente.</p>`
  });
}
