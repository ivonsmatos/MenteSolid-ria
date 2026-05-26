import type { UF } from '@/types';
import { jsonProvider } from './json';
import { sanityProvider } from './sanity';
import type { DiretorioProvider, FonteDiretorio, ServicoDiretorio } from './types';

export type { DiretorioRaw, FonteDiretorio, ServicoDiretorio, DiretorioProvider } from './types';

// Dispatcher: escolhe provider via env var. Default = json (sempre funcional).
function getProvider(): DiretorioProvider {
  const escolhido = (process.env.DIRETORIO_PROVIDER ?? 'json').toLowerCase();
  if (escolhido === 'sanity') return sanityProvider;
  return jsonProvider;
}

const provider = getProvider();

export async function carregarDiretorio() {
  return provider.carregar();
}

export async function listarUFsComServicos(): Promise<UF[]> {
  const { servicos } = await provider.carregar();
  return Array.from(new Set(servicos.map((s) => s.uf))).sort() as UF[];
}

export async function filtrarServicos(uf?: string): Promise<ServicoDiretorio[]> {
  const { servicos } = await provider.carregar();
  if (!uf) return servicos;
  return servicos.filter((s) => s.uf === uf);
}

export async function listarFontes(): Promise<FonteDiretorio[]> {
  const { fontes } = await provider.carregar();
  return fontes;
}
