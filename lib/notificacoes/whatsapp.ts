const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiKey = process.env.WHATSAPP_API_KEY;

export async function enviarMensagemWhatsApp(telefone: string, mensagem: string): Promise<void> {
  if (!whatsappApiUrl) {
    return;
  }

  const response = await fetch(whatsappApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(whatsappApiKey ? { Authorization: `Bearer ${whatsappApiKey}` } : {})
    },
    body: JSON.stringify({
      phone: telefone,
      message: mensagem
    })
  });

  if (!response.ok) {
    throw new Error('Falha ao enviar mensagem WhatsApp.');
  }
}

export async function notificarProfissional(
  profissional: { telefone: string; nome: string },
  encaminhamento: { resumo_clinico?: string }
): Promise<void> {
  await enviarMensagemWhatsApp(
    profissional.telefone,
    `Olá, ${profissional.nome}. Você recebeu um novo encaminhamento no MenteSolidária. Resumo: ${encaminhamento.resumo_clinico ?? 'Sem resumo.'}`
  );
}
