import { z } from 'zod';

export const areaSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(100, 'Descrição deve ter no máximo 100 caracteres'),

  garantia: z
    .string()
    .min(1, 'Descrição estendida é obrigatória')
    .min(10, 'Descrição estendida deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição estendida deve ter no máximo 500 caracteres'),
});

export type CreateAreaSchema = z.infer<typeof areaSchema>;
