// app/store-transfer/components/forms/store-transfer.schema.tsx

import { z } from 'zod';

export const storeTransferSchema = z
  .object({
    lojaOrigemId: z.string().min(1, 'Loja de origem é obrigatória'),

    lojaDestinoId: z.string().min(1, 'Loja de destino é obrigatória'),

    produtoId: z.string().min(1, 'Produto é obrigatório').uuid('ID do produto inválido'),

    quantidade: z
      .number({
        required_error: 'Quantidade é obrigatória',
        invalid_type_error: 'Quantidade deve ser um número',
      })
      .positive('Quantidade deve ser maior que zero')
      .min(0.01, 'Quantidade deve ser maior que zero'),
  })
  .refine((data) => data.lojaOrigemId !== data.lojaDestinoId, {
    message: 'Loja de origem e destino não podem ser iguais',
    path: ['lojaDestinoId'],
  });

export type CreateStoreTransferSchema = z.infer<typeof storeTransferSchema>;