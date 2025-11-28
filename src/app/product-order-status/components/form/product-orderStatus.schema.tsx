// app/product-orderStatus/components/form/product-orderStatus.schema.tsx

import { z } from 'zod';

export const orderStatusSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(2, 'Descrição deve ter pelo menos 2 caracteres')
    .max(50, 'Descrição deve ter no máximo 50 caracteres')
    .trim(),
});

export type CreateOrderStatusSchema = z.infer<typeof orderStatusSchema>;