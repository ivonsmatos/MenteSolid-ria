export function respostaErro(status: number, erro: string, detalhes?: unknown): Response {
  return Response.json(
    {
      erro,
      ...(detailsOrUndefined(detalhes) ? { detalhes } : {})
    },
    { status }
  );
}

function detailsOrUndefined(value: unknown): boolean {
  return typeof value !== 'undefined';
}
