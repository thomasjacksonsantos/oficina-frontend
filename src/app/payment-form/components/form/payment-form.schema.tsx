import { z } from 'zod';

export const paymentFormSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(100, 'Descrição deve ter no máximo 100 caracteres'),

  numeroParcela: z
    .number({
      required_error: 'Número de parcelas é obrigatório',
      invalid_type_error: 'Número de parcelas deve ser um número',
    })
    .min(1, 'O número mínimo de parcelas é 1'),

  tipoPagamento: z.string().min(1, 'Tipo de pagamento é obrigatório'),

  planoParcelamento: z.string().min(1, 'Plano de parcelamento é obrigatório'),
});

export type CreatePaymentFormSchema = z.infer<typeof paymentFormSchema>;
