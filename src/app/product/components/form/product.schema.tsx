import { z } from 'zod';

export const productSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),

  aplicacao: z
    .string()
    .min(1, 'Aplicação é obrigatória')
    .min(3, 'Aplicação deve ter pelo menos 3 caracteres')
    .max(500, 'Aplicação deve ter no máximo 500 caracteres'),

  referencia: z
    .string()
    .min(1, 'Referência é obrigatória')
    .max(50, 'Referência deve ter no máximo 50 caracteres'),

  codigoBarra: z
    .string()
    .min(1, 'Código de barras é obrigatório')
    .max(50, 'Código de barras deve ter no máximo 50 caracteres'),

  marca: z
    .string()
    .min(1, 'Marca é obrigatória')
    .max(100, 'Marca deve ter no máximo 100 caracteres'),

  grupo: z.string(),

  observacao: z.string().max(1000, 'Observação deve ter no máximo 1000 caracteres'),

  dadosComplementares: z.object({
    fornecedor: z
      .string()
      .min(1, 'Fornecedor é obrigatório')
      .max(200, 'Fornecedor deve ter no máximo 200 caracteres'),

    endereco: z
      .string()
      .min(1, 'Endereço é obrigatório')
      .max(500, 'Endereço deve ter no máximo 500 caracteres'),

    statusProduto: z.enum(['Ativo', 'Desativo'], {
      errorMap: () => ({ message: 'Status deve ser Ativo ou Desativo' }),
    }),

    estoque: z
      .number()
      .int('Estoque deve ser um número inteiro')
      .min(0, 'Estoque deve ser maior ou igual a 0'),

    tipoUnidade: z
      .string()
      .min(1, 'Tipo de unidade é obrigatório')
      .max(20, 'Tipo de unidade deve ter no máximo 20 caracteres'),
  }),

  dadosFiscalProduto: z.object({
    origemMercadoria: z
      .string()
      .min(1, 'Origem mercadoria é obrigatória')
      .max(100, 'Origem mercadoria deve ter no máximo 100 caracteres'),

    NCM: z.string().min(1, 'NCM é obrigatório').max(20, 'NCM deve ter no máximo 20 caracteres'),

    ANP: z.string().min(1, 'ANP é obrigatório').max(20, 'ANP deve ter no máximo 20 caracteres'),

    regraEspecificaParaEsteItem: z
      .string()
      .max(200, 'Regra específica deve ter no máximo 200 caracteres'),
  }),

  preco: z.object({
    compra: z.number().min(0, 'Valor de compra deve ser maior ou igual a 0'),

    venda: z.number().min(0, 'Valor de venda deve ser maior ou igual a 0'),

    custo: z.number().min(0, 'Valor de custo deve ser maior ou igual a 0'),

    compraFixo: z.number().min(0, 'Valor de compra fixo deve ser maior ou igual a 0'),

    dataCompra: z
      .string()
      .min(1, 'Data de compra é obrigatória')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),

    dataVenda: z
      .string()
      .min(1, 'Data de venda é obrigatória')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),

    dataCusto: z
      .string()
      .min(1, 'Data de custo é obrigatória')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),

    dataCompraFixo: z
      .string()
      .min(1, 'Data de compra fixo é obrigatória')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  }),

  markup: z.object({
    produto: z.number().min(0, 'Markup do produto deve ser maior ou igual a 0'),

    grupo: z.number().min(0, 'Markup do grupo deve ser maior ou igual a 0'),
  }),
});

export type CreateProductSchema = z.infer<typeof productSchema>;
