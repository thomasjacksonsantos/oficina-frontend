// app/stock-correction/components/forms/stock-correction.schema.tsx

import { z } from 'zod';

export const stockCorrectionSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório').uuid('ID do produto inválido'),

  tipoMovimentoEstoqueId: z
    .string()
    .min(1, 'Tipo de movimento é obrigatório')
    .uuid('Tipo de movimento inválido'),

  quantidade: z
    .number({
      required_error: 'Quantidade é obrigatória',
      invalid_type_error: 'Quantidade deve ser um número',
    })
    .positive('Quantidade deve ser maior que zero')
    .min(0.01, 'Quantidade deve ser maior que zero'),

  valorUnitario: z
    .number({
      required_error: 'Valor unitário é obrigatório',
      invalid_type_error: 'Valor unitário deve ser um número',
    })
    .positive('Valor unitário deve ser maior que zero')
    .min(0.01, 'Valor unitário deve ser maior que zero'),
});

export type CreateStockCorrectionSchema = z.infer<typeof stockCorrectionSchema>;
