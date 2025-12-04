import { z } from 'zod';
import { ManualEntryProductInput } from '@/api/manual-entry.types';

// Schema that matches the exact TypeScript types
const productInputSchema: z.ZodType<ManualEntryProductInput> = z.object({
  id: z.string().optional(),
  codigo: z.string().min(1, 'Código é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  aplicacao: z.string(),
  quantidade: z.number().min(0, 'Quantidade deve ser maior ou igual a 0'),
  valorUnitario: z.number().min(0, 'Valor unitário deve ser maior ou igual a 0'),
  valorTotal: z.number().min(0, 'Valor total deve ser maior ou igual a 0'),
  valorICMS: z.number(),
  valorIPI: z.number(),
  valorDesconto: z.number(),
  descontoTICompraSeg: z.number(),
  descontoTICompraImp: z.number(),
  compraAnterior: z.number(),
  compraAtual: z.number(),
  estoqueAtual: z.number(),
}) as any;

export const manualEntrySchema = z.object({
  codigo: z
    .string()
    .min(1, 'Código é obrigatório')
    .min(2, 'Código deve ter pelo menos 2 caracteres')
    .max(20, 'Código deve ter no máximo 20 caracteres'),

  data: z.string().min(1, 'Data é obrigatória'),

  nfRevenda: z.enum(['Sim', 'Não'], {
    required_error: 'NF Revenda é obrigatório',
  }),

  fornecedor: z.object({
    id: z.string().min(1, 'Fornecedor é obrigatório'),
    nome: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  }),

  dataEntrega: z.string().min(1, 'Data de entrega é obrigatória'),

  condicaoPagamento: z.number().min(0, 'Condição de pagamento deve ser maior ou igual a 0'),

  contato: z.string(),

  dataEmissao: z.string().min(1, 'Data de emissão é obrigatória'),

  numeroNotaFiscal: z
    .string()
    .min(1, 'Número da nota fiscal é obrigatório')
    .max(20, 'Número da nota fiscal deve ter no máximo 20 caracteres'),

  numeroPedidoCompra: z
    .string()
    .min(1, 'Número do pedido de compra é obrigatório')
    .max(20, 'Número do pedido de compra deve ter no máximo 20 caracteres'),

  chaveAcesso: z
    .string()
    .min(1, 'Chave de acesso é obrigatória')
    .length(44, 'Chave de acesso deve ter 44 caracteres'),

  observacao: z.string(),

  cabecalho: z.object({
    quantidadeItens: z.number(),
    totalQuantidade: z.number(),
    valorICMSSubstituicao: z.number(),
    valorTotalProdutos: z.number(),
    valorFrete: z.number(),
    valorSeguro: z.number(),
    valorDesconto: z.number(),
    outrasDespesasAcessorios: z.number(),
    valorTotalNota: z.number(),
  }),

  produtos: z.array(productInputSchema).min(1, 'Pelo menos um produto é obrigatório'),
});

// Use the CreateManualEntryInput type directly
export type CreateManualEntrySchema = z.infer<typeof manualEntrySchema>;
export type ManualEntryProductSchema = ManualEntryProductInput;
