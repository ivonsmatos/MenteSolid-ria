import type { DiretorioProvider, DiretorioRaw, ServicoDiretorio, FonteDiretorio } from './types';

// Provider Sanity (stub pronto para receber credenciais).
// Para ativar, defina as variáveis abaixo no .env e configure os schemas no
// projeto Sanity:
//   - "servicoSaudeMental" (mesmos campos de ServicoDiretorio)
//   - "fonteDiretorio" (nome, url, descricao)

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET ?? 'production';
const SANITY_API_VERSION = process.env.SANITY_API_VERSION ?? '2024-05-01';
const SANITY_TOKEN = process.env.SANITY_TOKEN;

function endpoint(query: string): string {
  if (!SANITY_PROJECT_ID) {
    throw new Error('SANITY_PROJECT_ID não configurado.');
  }
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  return url;
}

async function sanityFetch<T>(query: string): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (SANITY_TOKEN) headers.Authorization = `Bearer ${SANITY_TOKEN}`;
  const response = await fetch(endpoint(query), {
    headers,
    next: { revalidate: 300 }
  });
  if (!response.ok) {
    throw new Error(`Sanity ${response.status}: ${await response.text().catch(() => '')}`);
  }
  const json = (await response.json()) as { result: T };
  return json.result;
}

export const sanityProvider: DiretorioProvider = {
  async carregar(): Promise<DiretorioRaw> {
    if (!SANITY_PROJECT_ID) {
      throw new Error('Sanity provider selecionado mas SANITY_PROJECT_ID não está definido.');
    }
    const [servicos, fontes] = await Promise.all([
      sanityFetch<ServicoDiretorio[]>(
        '*[_type == "servicoSaudeMental"]{id, nome, tipo, cidade, uf, publico, telefone}'
      ),
      sanityFetch<FonteDiretorio[]>('*[_type == "fonteDiretorio"]{nome, url, descricao}')
    ]);
    return { servicos, fontes };
  }
};
