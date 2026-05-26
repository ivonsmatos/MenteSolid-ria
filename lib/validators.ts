import { z } from 'zod';

export const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO'
] as const;

export const ufSchema = z.enum(UFS, {
  errorMap: () => ({ message: 'UF inválida. Use a sigla com 2 letras (ex.: SP).' })
});

const telefoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;
export const telefoneSchema = z
  .string()
  .trim()
  .regex(telefoneRegex, 'Telefone inválido. Use formato brasileiro com DDD.');

const crpRegex = /^CRP\s?\d{2}\/\d{4,6}$/i;
const crmRegex = /^CRM\/?[A-Z]{2}\s?\d{4,6}$/i;
export const numeroRegistroSchema = z
  .string()
  .trim()
  .refine(
    (v) => crpRegex.test(v) || crmRegex.test(v),
    'Registro inválido. Use "CRP 06/123456" ou "CRM/SP 123456".'
  );

export const calLinkSchema = z
  .string()
  .trim()
  .url('Use uma URL válida (https://cal.com/seu-usuario).')
  .refine(
    (v) => /^https?:\/\/(?:www\.)?cal\.com\//i.test(v),
    'O link deve apontar para cal.com (ex.: https://cal.com/seu-usuario).'
  )
  .optional()
  .or(z.literal('').transform(() => undefined));

export const triagemStatusSchema = z.enum(
  ['novo', 'em_atendimento', 'encaminhado', 'encerrado'],
  { errorMap: () => ({ message: 'Status inválido.' }) }
);

export const atualizarTriagemSchema = z.object({
  status: triagemStatusSchema.optional(),
  claim: z.boolean().optional()
}).refine(
  (v) => v.status !== undefined || v.claim === true,
  'Informe um status ou marque claim=true.'
);

export const pacienteSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório.'),
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.'),
  telefone: telefoneSchema,
  cidade: z.string().trim().min(1, 'Cidade é obrigatória.'),
  uf: ufSchema,
  dataNascimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida (use AAAA-MM-DD).')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  genero: z
    .enum(['masculino', 'feminino', 'nao_binario', 'prefiro_nao_dizer'])
    .optional()
    .or(z.literal('').transform(() => undefined)),
  comoChegou: z.string().trim().optional()
});

export const pacientePublicoCadastroSchema = pacienteSchema.extend({
  consentimentoLgpd: z.literal(true, {
    errorMap: () => ({ message: 'É necessário aceitar o termo LGPD para continuar.' })
  })
});

export const profissionalSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório.'),
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.'),
  telefone: telefoneSchema,
  cidade: z.string().trim().min(1, 'Cidade é obrigatória.'),
  uf: ufSchema,
  especialidade: z.enum(['psicologia', 'psiquiatria'], {
    errorMap: () => ({ message: 'Especialidade deve ser psicologia ou psiquiatria.' })
  }),
  numeroRegistro: numeroRegistroSchema,
  ativo: z.boolean().optional(),
  calLink: calLinkSchema
});

export const atualizarProfissionalSchema = z.object({
  telefone: telefoneSchema.optional(),
  cidade: z.string().trim().min(1).optional(),
  uf: ufSchema.optional(),
  calLink: calLinkSchema
});

export const triagemSchema = z.object({
  motivoDaBusca: z.string().trim().min(1, 'Motivo da busca é obrigatório.'),
  sintomasRelatados: z
    .array(z.string().trim().min(1))
    .min(1, 'Informe ao menos um sintoma.'),
  tempoDeQueixa: z.string().trim().min(1, 'Tempo de queixa é obrigatório.'),
  impactoNaRotina: z.string().trim().min(1, 'Impacto na rotina é obrigatório.'),
  perfilIndicado: z.enum(['psicologia', 'psiquiatria', 'indefinido'], {
    errorMap: () => ({ message: 'Perfil indicado inválido.' })
  }),
  sinalDeAlerta: z.boolean(),
  resumoClinicoParaEspecialista: z
    .string()
    .trim()
    .min(1, 'Resumo clínico para especialista é obrigatório.')
});

export type PacienteInput = z.infer<typeof pacienteSchema>;
export type PacientePublicoCadastroInput = z.infer<typeof pacientePublicoCadastroSchema>;
export type ProfissionalInput = z.infer<typeof profissionalSchema>;
export type AtualizarProfissionalInput = z.infer<typeof atualizarProfissionalSchema>;
export type TriagemInput = z.infer<typeof triagemSchema>;
export type AtualizarTriagemInput = z.infer<typeof atualizarTriagemSchema>;
export type TriagemStatusInput = z.infer<typeof triagemStatusSchema>;
