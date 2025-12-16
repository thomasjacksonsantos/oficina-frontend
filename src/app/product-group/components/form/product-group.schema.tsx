import { z } from 'zod';

export const productGroupSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),

  area: z
    .string()
    .min(1, 'Área é obrigatória')
    .min(2, 'Área deve ter pelo menos 2 caracteres')
    .max(100, 'Área deve ter no máximo 100 caracteres'),

  ncm: z
    .string()
    .min(1, 'NCM é obrigatório')
    .regex(/^\d{8}$|^\d{4}\.\d{2}\.\d{2}$/, 'NCM deve ter 8 dígitos ou formato 0000.00.00'),

  anp: z
    .string()
    .min(1, 'ANP é obrigatório')
    .min(3, 'ANP deve ter pelo menos 3 caracteres')
    .max(50, 'ANP deve ter no máximo 50 caracteres'),
});

export type CreateProductGroupSchema = z.infer<typeof productGroupSchema>;
