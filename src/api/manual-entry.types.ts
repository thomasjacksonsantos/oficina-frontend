// Shared type for both cabecalho and lancado
export type ManualEntryTotals = {
  quantidadeItens: number;
  totalQuantidade: number;
  valorICMSSubstituicao: number;
  valorTotalProdutos: number;
  valorFrete: number;
  valorSeguro: number;
  valorDesconto: number;
  outrasDespesasAcessorios: number;
  valorTotalNota: number;
};

// Base product fields (without id)
type ManualEntryProductBase = {
  codigo: string;
  descricao: string;
  aplicacao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  valorICMS: number;
  valorIPI: number;
  valorDesconto: number;
  descontoTICompraSeg: number;
  descontoTICompraImp: number;
  compraAnterior: number;
  compraAtual: number;
  estoqueAtual: number;
};

// Product from API (with required id)
export type ManualEntryProduct = ManualEntryProductBase & {
  id: string;
};

// Product for forms (with optional id)
export type ManualEntryProductInput = ManualEntryProductBase & {
  id?: string;
};

export type ManualEntry = {
  id: string;
  codigo: string;
  data: string;
  nfRevenda: string;
  fornecedor: {
    id: string;
    nome: string;
  };
  dataEntrega: string;
  condicaoPagamento: number;
  contato: string;
  dataEmissao: string;
  numeroNotaFiscal: string;
  numeroPedidoCompra: string;
  chaveAcesso: string;
  observacao: string;
  cabecalho: ManualEntryTotals;
  lancado: ManualEntryTotals;
  produtos: ManualEntryProduct[];
  status?: string;
};

// For create/update, lancado is not included (it's auto-calculated from cabecalho)
export type CreateManualEntryInput = Omit<ManualEntry, 'id' | 'status' | 'lancado' | 'produtos'> & {
  id?: string;
  produtos: ManualEntryProductInput[];
};

export type UpdateManualEntryInput = Partial<CreateManualEntryInput>;
