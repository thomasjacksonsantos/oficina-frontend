import { z } from 'zod';

export const bandeiraCartaoSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição da Bandeira é obrigatória')
    .min(2, 'Descrição deve ter pelo menos 2 caracteres')
    .max(100, 'Descrição deve ter no máximo 100 caracteres'),

  planoContaRecebimento: z
    .string()
    .min(1, 'Plano de Conta dos Recebimentos é obrigatório'),

  formaPagamento: z
    .string()
    .min(1, 'Forma de Recebimento é obrigatória'),

  banco: z.object({
    nome: z
      .string()
      .min(1, 'Banco é obrigatório')
      .min(2, 'Nome do banco deve ter pelo menos 2 caracteres')
      .max(100, 'Nome do banco deve ter no máximo 100 caracteres'),
  }),
});

export type CreateBandeiraCartaoSchema = z.infer<typeof bandeiraCartaoSchema>;