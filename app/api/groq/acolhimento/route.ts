import { getServerSession } from '@/lib/auth/config';
import { requireAuth } from '@/lib/auth/guards';
import { gerarRespostaAcolhimento } from '@/lib/groq/acolhimento';
import { respostaErro } from '@/lib/http/json';

export async function POST(request: Request): Promise<Response> {
  try {
    const session = await getServerSession();
    requireAuth(session);

    const body = (await request.json()) as {
      mensagem?: string;
      historico?: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    if (!body.mensagem) {
      return respostaErro(400, 'Campo mensagem é obrigatório.');
    }

    const resultado = await gerarRespostaAcolhimento(body.mensagem, body.historico ?? []);

    const encoder = new TextEncoder();
    const payload = JSON.stringify(resultado);

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(payload));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('não autenticado')) {
      return respostaErro(401, 'Usuário não autenticado.');
    }

    return respostaErro(500, 'Falha ao processar acolhimento.');
  }
}
