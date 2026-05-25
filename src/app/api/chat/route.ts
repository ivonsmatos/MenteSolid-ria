export const runtime = 'edge';

import Groq from 'groq-sdk';

// Assistente de acolhimento inicial com diretrizes de segurança em saúde mental.
const SYSTEM_PROMPT = `Você é um assistente de acolhimento inicial do MenteSolidária.

Diretrizes obrigatórias:
- Nunca emitir diagnóstico médico.
- Detectar risco de vida e orientar contato imediato com CVV 188 e emergência local.
- Manter tom empático, caloroso e não clínico.
- Coletar informações básicas para triagem sem solicitar dados sensíveis desnecessários.
- Responder sempre em português do Brasil.
`;

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY não configurada no ambiente.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const { messages } = (await request.json()) as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  };

  const stream = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    stream: true,
    max_tokens: 1024,
    temperature: 0.7
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
