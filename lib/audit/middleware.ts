import { getServerSession } from '@/lib/auth/config';
import { registrarAcesso } from '@/lib/audit/logger';

export function comAudit<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>,
  acao: string,
  recurso: string
) {
  return async (...args: T): Promise<Response> => {
    const session = await getServerSession();
    const request = args[0] as Request;
    const url = new URL(request.url);
    const recursoId =
      url.searchParams.get('recursoId') ?? url.searchParams.get('id') ?? url.searchParams.get('pacienteId');

    await registrarAcesso({
      userId: session?.user?.id,
      acao,
      recurso,
      recursoId: recursoId ?? undefined
    });

    return handler(...args);
  };
}
