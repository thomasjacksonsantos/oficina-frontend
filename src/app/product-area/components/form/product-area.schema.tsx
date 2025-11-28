import { z } from 'zod';

export const areaSchema = z.object({
  codigo: z
    .string()
    .min(1, 'Código é obrigatório')
    .min(2, 'Código deve ter pelo menos 2 caracteres')
    .max(20, 'Código deve ter no máximo 20 caracteres')
    .regex(/^[A-Z0-9-]+$/, 'Código deve conter apenas letras maiúsculas, números e hífens')
    .transform((val) => val.toUpperCase()),

  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(100, 'Descrição deve ter no máximo 100 caracteres'),

  descricaoEstendida: z
    .string()
    .min(1, 'Descrição estendida é obrigatória')
    .min(10, 'Descrição estendida deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição estendida deve ter no máximo 500 caracteres'),

  garantia: z
    .string()
    .min(1, 'Garantia é obrigatória')
    .regex(/^\d+$/, 'Garantia deve conter apenas números')
    .refine((val) => {
      const num = parseInt(val);
      return num >= 0 && num <= 120;
    }, 'Garantia deve estar entre 0 e 120 meses'),
});

export type CreateAreaSchema = z.infer<typeof areaSchema>;
