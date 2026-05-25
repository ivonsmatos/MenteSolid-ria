import { getServerSession } from '@/lib/auth/config';
import { requireAuth } from '@/lib/auth/guards';
import { respostaErro } from '@/lib/http/json';
import { listarAcessos } from '@/lib/audit/logger';

export async function GET(request: Request): Promise<Response> {
  try {
    const session = await getServerSession();
    requireAuth(session);

    const { searchParams } = new URL(request.url);
    const recursoId = searchParams.get('recursoId');
    const recurso = searchParams.get('recurso');

    if (session.user.email !== 'admin@mentesolidaria.org') {
      return respostaErro(403, 'Acesso permitido apenas para administradores.');
    }

    if (!recursoId || !recurso) {
      return respostaErro(400, 'Parâmetros obrigatórios: recursoId e recurso.');
    }

    const acessos = await listarAcessos(recursoId, recurso);
    return Response.json(acessos);
  } catch {
    return respostaErro(500, 'Falha ao listar audit logs.');
  }
}
