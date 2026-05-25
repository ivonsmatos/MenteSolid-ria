import { cacheGet, cachePut } from '@/lib/cloudflare/cache';
import { gerarRespostaAcolhimento } from '@/lib/groq/acolhimento';
import { respostaErro } from '@/lib/http/json';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const TTL_CACHE_GROQ = 300;
const padraoSensivel = /(cpf|rg|telefone|email|endereco|paciente|prontuario|clinic|pii|lgpd)/i;

async function criarHashCache(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hex;
}

function cachePublicoPermitido(
  mensagem: string,
  historico: Array<{ role: 'user' | 'assistant'; content: string }>
): boolean {
  if (padraoSensivel.test(mensagem)) {
    return false;
  }

  return historico.every((item) => !padraoSensivel.test(item.content));
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return respostaErro(401, 'Usuário não autenticado.');
    }

    const body = (await request.json()) as {
      mensagem?: string;
      historico?: Array<{ role: 'user' | 'assistant'; content: string }>;
      cachePublico?: boolean;
    };

    if (!body.mensagem) {
      return respostaErro(400, 'Campo mensagem é obrigatório.');
    }

    const historico = body.historico ?? [];
    const deveCachear = body.cachePublico === true && cachePublicoPermitido(body.mensagem, historico);
    let chaveCache: string | null = null;

    if (deveCachear) {
      const hashCache = await criarHashCache(
        JSON.stringify({
          mensagem: body.mensagem,
          historico
        })
      );

      chaveCache = `groq:publico:${hashCache}`;
      const respostaCache = await cacheGet<{
        resposta: string;
        alertaCVV: boolean;
        dadosTriagem: Record<string, unknown>;
      }>(chaveCache);

      if (respostaCache) {
        return Response.json(respostaCache, {
          headers: {
            'Cache-Control': 'no-store'
          }
        });
      }
    }

    const resultado = await gerarRespostaAcolhimento(body.mensagem, historico);

    if (chaveCache) {
      await cachePut(chaveCache, resultado, TTL_CACHE_GROQ);
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
  } catch (error) {
    return respostaErro(500, 'Falha ao processar acolhimento.');
  }
}
