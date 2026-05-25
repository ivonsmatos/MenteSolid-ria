import type { LocalTriagem } from '@/types/fhir';
import { groqClient, groqConfig } from '@/lib/groq/client';

interface MensagemChat {
  role: 'user' | 'assistant';
  content: string;
}

const PROMPT_ACOLHIMENTO = `Você é um assistente de acolhimento inicial em saúde mental do MenteSolidária.
- NÃO emita diagnóstico médico.
- Se detectar risco de vida, recomende imediatamente CVV 188.
- Mantenha tom acolhedor, empático e não clínico.
- Colete informações úteis para triagem estruturada (sintomas, tempo, impacto, prioridade).`;

const palavrasRisco = ['morrer', 'suic', 'me matar', 'tirar minha vida', 'acabar com tudo'];

function detectarAlertaCVV(texto: string): boolean {
  const normalizado = texto.toLowerCase();
  return palavrasRisco.some((palavra) => normalizado.includes(palavra));
}

function extrairDadosTriagem(texto: string): Partial<LocalTriagem> {
  const alertaCVV = detectarAlertaCVV(texto);

  return {
    alertaCVV188: alertaCVV,
    prioridade: alertaCVV ? 'urgente' : 'media',
    sinalDeAlerta: alertaCVV
  };
}

export async function gerarRespostaAcolhimento(
  mensagem: string,
  historico: MensagemChat[] = []
): Promise<{ resposta: string; alertaCVV: boolean; dadosTriagem: Partial<LocalTriagem> }> {
  const alertaCVVMensagem = detectarAlertaCVV(mensagem);

  if (!process.env.GROQ_API_KEY) {
    const respostaFallback = alertaCVVMensagem
      ? 'Sinto muito por você estar passando por isso. Sua segurança é prioridade. Ligue agora para o CVV 188 e, se houver risco imediato, procure o SAMU 192.'
      : 'Obrigado por compartilhar. Estou aqui para te acolher. Você pode me contar há quanto tempo isso começou e como está impactando sua rotina?';

    return {
      resposta: respostaFallback,
      alertaCVV: alertaCVVMensagem,
      dadosTriagem: extrairDadosTriagem(mensagem)
    };
  }

  const completion = await groqClient.chat.completions.create({
    model: groqConfig.modeloPadrao,
    temperature: 0.4,
    messages: [
      { role: 'system', content: PROMPT_ACOLHIMENTO },
      ...historico,
      { role: 'user', content: mensagem }
    ]
  });

  const resposta = completion.choices[0]?.message?.content?.trim() ?? '';
  const alertaCVV = detectarAlertaCVV(`${mensagem} ${resposta}`);

  return {
    resposta,
    alertaCVV,
    dadosTriagem: {
      ...extrairDadosTriagem(`${mensagem} ${resposta}`),
      alertaCVV188: alertaCVV,
      sinalDeAlerta: alertaCVV
    }
  };
}
