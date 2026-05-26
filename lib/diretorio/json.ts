import diretorioJson from '@/data/diretorio.json';
import type { DiretorioProvider, DiretorioRaw } from './types';

const dados = diretorioJson as DiretorioRaw;

// Provider local: serve o JSON embutido. Útil em dev e em deploys sem CMS.
export const jsonProvider: DiretorioProvider = {
  async carregar() {
    return dados;
  }
};
