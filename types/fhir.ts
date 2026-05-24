import type {
  DocumentReference,
  Encounter,
  Observation,
  Patient,
  ServiceRequest
} from '@medplum/fhirtypes';
import type { Paciente, TriagemEncaminhamento } from '@/types';

export type PrioridadeTriagem = 'baixa' | 'media' | 'alta' | 'urgente';

export interface LocalPatient {
  id?: string;
  nome: Paciente['nome'];
  email?: Paciente['email'];
  telefone?: Paciente['telefone'];
  cidade?: Paciente['cidade'];
  estado?: Paciente['estado'];
  dataNascimento?: Paciente['dataNascimento'];
  genero?: Paciente['genero'];
  comoChegou?: Paciente['comoChegou'];
  criadoEm?: Paciente['criadoEm'];
  triagem?: TriagemEncaminhamento;
  cpf?: string;
  vulnerabilidadeSocioeconomica?: boolean;
}

export interface LocalTriagem {
  motivoDaBusca: TriagemEncaminhamento['motivoDaBusca'];
  sintomasRelatados: TriagemEncaminhamento['sintomasRelatados'];
  tempoDeQueixa: TriagemEncaminhamento['tempoDeQueixa'];
  impactoNaRotina: TriagemEncaminhamento['impactoNaRotina'];
  perfilIndicado: TriagemEncaminhamento['perfilIndicado'];
  resumoClinicoParaEspecialista: TriagemEncaminhamento['resumoClinicoParaEspecialista'];
  criadoEm?: TriagemEncaminhamento['criadoEm'];
  prioridade: PrioridadeTriagem;
  alertaCVV188?: boolean;
  sinalDeAlerta?: TriagemEncaminhamento['sinalDeAlerta'];
}

export interface LocalEncaminhamento {
  prioridade: PrioridadeTriagem;
  especialidadeDestino: 'psicologia' | 'psiquiatria' | 'indefinido';
  resumoClinico: string;
  observacoes?: string;
}

export type {
  DocumentReference,
  Encounter,
  Observation,
  Patient,
  ServiceRequest
} from '@medplum/fhirtypes';
