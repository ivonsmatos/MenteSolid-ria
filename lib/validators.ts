import { z } from 'zod';

export const pacienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Informe um e-mail válido.'),
  telefone: z.string().min(1, 'Telefone é obrigatório.'),
  cidade: z.string().min(1, 'Cidade é obrigatória.'),
  estado: z.string().min(1, 'Estado é obrigatório.'),
  dataNascimento: z.string().optional(),
  genero: z.enum(['masculino', 'feminino', 'nao_binario', 'prefiro_nao_dizer']).optional(),
  comoChegou: z.string().optional()
});

export const profissionalSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Informe um e-mail válido.'),
  telefone: z.string().min(1, 'Telefone é obrigatório.'),
  cidade: z.string().min(1, 'Cidade é obrigatória.'),
  estado: z.string().min(1, 'Estado é obrigatório.'),
  especialidade: z.enum(['psicologia', 'psiquiatria'], {
    errorMap: () => ({ message: 'Especialidade deve ser psicologia ou psiquiatria.' })
  }),
  numeroRegistro: z.string().min(1, 'CRP/CRM é obrigatório.'),
  ativo: z.boolean().optional()
});

export const triagemSchema = z.object({
  motivoDaBusca: z.string().min(1, 'Motivo da busca é obrigatório.'),
  sintomasRelatados: z.array(z.string().min(1)).min(1, 'Informe ao menos um sintoma.'),
  tempoDeQueixa: z.string().min(1, 'Tempo de queixa é obrigatório.'),
  impactoNaRotina: z.string().min(1, 'Impacto na rotina é obrigatório.'),
  perfilIndicado: z.enum(['psicologia', 'psiquiatria', 'indefinido'], {
    errorMap: () => ({ message: 'Perfil indicado inválido.' })
  }),
  sinalDeAlerta: z.boolean(),
  resumoClinicoParaEspecialista: z
    .string()
    .min(1, 'Resumo clínico para especialista é obrigatório.')
});

export type PacienteInput = z.infer<typeof pacienteSchema>;
export type ProfissionalInput = z.infer<typeof profissionalSchema>;
export type TriagemInput = z.infer<typeof triagemSchema>;
