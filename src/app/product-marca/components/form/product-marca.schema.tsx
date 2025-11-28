// app/product-marca/components/form/product-marca.schema.tsx

import { z } from 'zod';

export const marcaSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(2, 'Descrição deve ter pelo menos 2 caracteres')
    .max(50, 'Descrição deve ter no máximo 50 caracteres')
    .trim(),
});

export type CreateMarcaSchema = z.infer<typeof marcaSchema>;