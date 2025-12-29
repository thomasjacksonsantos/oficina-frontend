import { z } from 'zod';

export const productSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(2, 'Descrição deve ter pelo menos 2 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),

  grupoProduto: z.string().min(1, 'Grupo é obrigatório'),

  fornecedorId: z.string().min(1, 'Fornecedor é obrigatório'),

  referencia: z
    .string()
    .min(1, 'Referência é obrigatória')
    .max(50, 'Referência deve ter no máximo 50 caracteres'),

  unidadeProduto: z.string().min(1, 'Unidade é obrigatória'),

  origemMercadoria: z.string().min(1, 'Origem da mercadoria é obrigatória'),

  ncm: z
    .string()
    .min(1, 'NCM é obrigatório')
    .max(20, 'NCM deve ter no máximo 20 caracteres'),

  observacao: z.string().optional(),
});

export const updateProductSchema = productSchema.extend({
  id: z.string().min(1, 'ID é obrigatório'),
  produtoStatus: z.string().min(1, 'Status é obrigatório'),
  grupoProdutoId: z.string().min(1, 'Grupo é obrigatório'),
  unidadeProdutoId: z.string().min(1, 'Unidade é obrigatória'),
});

export type CreateProductSchema = z.infer<typeof productSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
