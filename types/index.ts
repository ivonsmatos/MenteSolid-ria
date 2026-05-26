import type { UFS } from '@/lib/validators';

export type UF = (typeof UFS)[number];

export type PapelUsuario = 'paciente' | 'profissional' | 'admin' | 'anonimo';

export interface Paciente {
  id: string;
  userId?: string | null;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: UF;
  dataNascimento?: string | null;
  genero?: 'masculino' | 'feminino' | 'nao_binario' | 'prefiro_nao_dizer' | null;
  comoChegou?: string | null;
  criadoEm: string;
  triagem?: TriagemEncaminhamento | null;
}

export interface Profissional {
  id: string;
  userId: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: UF;
  especialidade: 'psicologia' | 'psiquiatria';
  numeroRegistro: string;
  ativo: boolean;
  calLink?: string | null;
  criadoEm: string;
}

export type TriagemStatus = 'novo' | 'em_atendimento' | 'encaminhado' | 'encerrado';

export interface TriagemEncaminhamento {
  id?: string;
  pacienteId?: string;
  profissionalId?: string | null;
  motivoDaBusca: string;
  sintomasRelatados: string[];
  tempoDeQueixa: string;
  impactoNaRotina: string;
  perfilIndicado: 'psicologia' | 'psiquiatria' | 'indefinido';
  sinalDeAlerta: boolean;
  resumoClinicoParaEspecialista: string;
  status?: TriagemStatus;
  criadoEm: string;
  atualizadoEm?: string;
}

export interface PainelCaso {
  triagemId: string;
  status: TriagemStatus;
  sinalDeAlerta: boolean;
  perfilIndicado: 'psicologia' | 'psiquiatria' | 'indefinido';
  criadoEm: string;
  atualizadoEm: string;
  profissionalId: string | null;
  pacienteId: string;
  pacienteNome: string;
  pacienteCidade: string;
  pacienteUf: UF;
}
