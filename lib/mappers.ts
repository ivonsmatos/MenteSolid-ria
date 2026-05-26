import type {
  PainelCaso,
  Paciente,
  Profissional,
  TriagemEncaminhamento,
  TriagemStatus,
  UF
} from '@/types';

type PacienteRow = {
  id: string;
  user_id: string | null;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  data_nascimento: string | null;
  genero: string | null;
  como_chegou: string | null;
  criado_em: string;
};

type TriagemRow = {
  id: string;
  paciente_id: string;
  profissional_id: string | null;
  motivo_da_busca: string;
  sintomas_relatados: string[];
  tempo_de_queixa: string;
  impacto_na_rotina: string;
  perfil_indicado: string;
  sinal_de_alerta: boolean;
  resumo_clinico: string;
  status?: string;
  criado_em: string;
  atualizado_em: string;
};

type ProfissionalRow = {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  especialidade: string;
  numero_registro: string;
  ativo: boolean;
  cal_link?: string | null;
  criado_em: string;
};

type PainelCasoRow = {
  triagem_id: string;
  status: string;
  sinal_de_alerta: boolean;
  perfil_indicado: string;
  criado_em: string;
  atualizado_em: string;
  profissional_id: string | null;
  paciente_id: string;
  paciente_nome: string;
  paciente_cidade: string;
  paciente_uf: string;
};

export function pacienteFromRow(row: PacienteRow, triagem?: TriagemRow | null): Paciente {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome,
    email: row.email,
    telefone: row.telefone,
    cidade: row.cidade,
    uf: row.uf as Paciente['uf'],
    dataNascimento: row.data_nascimento,
    genero: row.genero as Paciente['genero'],
    comoChegou: row.como_chegou,
    criadoEm: row.criado_em,
    triagem: triagem ? triagemFromRow(triagem) : null
  };
}

export function triagemFromRow(row: TriagemRow): TriagemEncaminhamento {
  return {
    id: row.id,
    pacienteId: row.paciente_id,
    profissionalId: row.profissional_id,
    motivoDaBusca: row.motivo_da_busca,
    sintomasRelatados: row.sintomas_relatados,
    tempoDeQueixa: row.tempo_de_queixa,
    impactoNaRotina: row.impacto_na_rotina,
    perfilIndicado: row.perfil_indicado as TriagemEncaminhamento['perfilIndicado'],
    sinalDeAlerta: row.sinal_de_alerta,
    resumoClinicoParaEspecialista: row.resumo_clinico,
    status: (row.status ?? 'novo') as TriagemStatus,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em
  };
}

export function profissionalFromRow(row: ProfissionalRow): Profissional {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome,
    email: row.email,
    telefone: row.telefone,
    cidade: row.cidade,
    uf: row.uf as Profissional['uf'],
    especialidade: row.especialidade as Profissional['especialidade'],
    numeroRegistro: row.numero_registro,
    ativo: row.ativo,
    calLink: row.cal_link ?? null,
    criadoEm: row.criado_em
  };
}

export function painelCasoFromRow(row: PainelCasoRow): PainelCaso {
  return {
    triagemId: row.triagem_id,
    status: row.status as TriagemStatus,
    sinalDeAlerta: row.sinal_de_alerta,
    perfilIndicado: row.perfil_indicado as PainelCaso['perfilIndicado'],
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
    profissionalId: row.profissional_id,
    pacienteId: row.paciente_id,
    pacienteNome: row.paciente_nome,
    pacienteCidade: row.paciente_cidade,
    pacienteUf: row.paciente_uf as UF
  };
}
