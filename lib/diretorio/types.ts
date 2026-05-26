import type { UF } from '@/types';

export interface ServicoDiretorio {
  id: string;
  nome: string;
  tipo: 'CAPS' | 'Clínica-Escola' | string;
  cidade: string;
  uf: UF;
  publico: string;
  telefone: string;
}

export interface FonteDiretorio {
  nome: string;
  url: string;
  descricao: string;
}

export interface DiretorioRaw {
  fontes: FonteDiretorio[];
  servicos: ServicoDiretorio[];
}

export interface DiretorioProvider {
  carregar(): Promise<DiretorioRaw>;
}
