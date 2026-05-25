import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import {
  cacheGet,
  cachePut,
  isGroqRespostaNaoSensivelCacheavel
} from '@/lib/cloudflare/cache';
import { gerarRespostaAcolhimento } from '@/lib/groq/acolhimento';
import { respostaErro } from '@/lib/http/json';

export const runtime = 'edge';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token?.id) {
      return respostaErro(401, 'Usuário não autenticado.');
    }

    const body = (await request.json()) as {
      mensagem?: string;
      historico?: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    if (!body.mensagem) {
      return respostaErro(400, 'Campo mensagem é obrigatório.');
    }

    const historico = body.historico ?? [];
    const cacheavel = isGroqRespostaNaoSensivelCacheavel(body.mensagem, historico.length);
    const cacheKey = `groq:acolhimento:publico:${body.mensagem}`;
    const resultadoEmCache = cacheavel
      ? await cacheGet<{ resposta: string; alertaCVV: boolean; dadosTriagem: unknown }>(cacheKey)
      : null;
    const resultado = resultadoEmCache ?? (await gerarRespostaAcolhimento(body.mensagem, historico));
    if (cacheavel && !resultadoEmCache) {
      await cachePut(cacheKey, resultado, 300);
    }

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
  } catch {
    return respostaErro(500, 'Falha ao processar acolhimento.');
  }
}
