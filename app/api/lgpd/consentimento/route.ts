import { respostaErro } from '@/lib/http/json';
import { lgpdConstantes, registrarConsentimento } from '@/lib/lgpd/consentimento';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as { paciente_id?: string };

    if (!body.paciente_id) {
      return respostaErro(400, 'paciente_id é obrigatório.');
    }

    const ip = request.headers.get('x-forwarded-for') ?? '0.0.0.0';
    const consentimento = await registrarConsentimento(body.paciente_id, ip);

    return Response.json(
      {
        ...consentimento,
        versao_termos: lgpdConstantes.VERSAO_TERMOS_ATUAL
      },
      { status: 201 }
    );
  } catch {
    return respostaErro(500, 'Falha ao registrar consentimento LGPD.');
  }
}
