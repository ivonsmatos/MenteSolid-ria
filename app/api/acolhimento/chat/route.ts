import { NextResponse } from 'next/server';
import { z } from 'zod';
import { chatCompletion, GroqError, type ChatMessage } from '@/lib/groq/client';
import { SYSTEM_PROMPT_ACOLHIMENTO } from '@/lib/groq/prompt';
import { detectarRisco, MENSAGEM_EMERGENCIA_CVV } from '@/lib/groq/risco';
import { TRIAGEM_TOOL, parseTriagemArgs, type TriagemFunctionArgs } from '@/lib/groq/tools';
import { captureError, logInfo } from '@/lib/observability';

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000)
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(30)
});

export interface ChatRouteResponse {
  reply: string;
  riscoDetectado: boolean;
  triagem?: TriagemFunctionArgs;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  const ultimaUsuario = [...parsed.data.messages].reverse().find((m) => m.role === 'user');
  if (ultimaUsuario) {
    const det = detectarRisco(ultimaUsuario.content);
    if (det.risco) {
      logInfo('acolhimento.risco.detectado', { padrao: det.padraoMatched });
      const response: ChatRouteResponse = {
        reply: MENSAGEM_EMERGENCIA_CVV,
        riscoDetectado: true
      };
      return NextResponse.json(response);
    }
  }

  const groqMessages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT_ACOLHIMENTO },
    ...parsed.data.messages.map<ChatMessage>((m) => ({ role: m.role, content: m.content }))
  ];

  try {
    const completion = await chatCompletion({
      messages: groqMessages,
      tools: [TRIAGEM_TOOL]
    });

    const choice = completion.choices[0];
    if (!choice) {
      return NextResponse.json({ error: 'Sem resposta da IA.' }, { status: 502 });
    }

    if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls?.length) {
      const call = choice.message.tool_calls[0];
      const args = parseTriagemArgs(call.function.arguments);
      if (!args) {
        return NextResponse.json(
          { error: 'Triagem retornada pela IA está incompleta.' },
          { status: 502 }
        );
      }
      const response: ChatRouteResponse = {
        reply:
          'Obrigado por compartilhar comigo. Vou organizar o que conversamos para um profissional voluntário entrar em contato. Você pode revisar e enviar abaixo.',
        riscoDetectado: args.sinal_de_alerta,
        triagem: args
      };
      return NextResponse.json(response);
    }

    const reply = choice.message.content ?? '';
    const response: ChatRouteResponse = {
      reply,
      riscoDetectado: false
    };
    return NextResponse.json(response);
  } catch (e) {
    captureError(e, { rota: '/api/acolhimento/chat' });
    if (e instanceof GroqError) {
      return NextResponse.json({ error: e.message }, { status: e.status === 401 ? 500 : 502 });
    }
    const msg = e instanceof Error ? e.message : 'Erro desconhecido.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
