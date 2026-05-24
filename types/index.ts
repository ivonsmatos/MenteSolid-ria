export interface Paciente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  dataNascimento?: string;
  genero?: 'masculino' | 'feminino' | 'nao_binario' | 'prefiro_nao_dizer';
  comoChegou?: string;
  criadoEm: string;
  triagem?: TriagemEncaminhamento;
}

export interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  especialidade: 'psicologia' | 'psiquiatria';
  numeroRegistro: string;
  ativo: boolean;
  criadoEm: string;
}

export interface TriagemEncaminhamento {
  motivoDaBusca: string;
  sintomasRelatados: string[];
  tempoDeQueixa: string;
  impactoNaRotina: string;
  perfilIndicado: 'psicologia' | 'psiquiatria' | 'indefinido';
  sinalDeAlerta: boolean;
  resumoClinicoParaEspecialista: string;
  criadoEm: string;
}
