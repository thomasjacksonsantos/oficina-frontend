// api/stock-correction.types.ts

export type StockCorrection = {
  id: string;
  produtoId: string;
  descricao: string;
  data: string;
  quantidade: number;
  quantidadeAntes: number;
  quantidadeDiferenca: number;
  valorUnitario: number;
  tipoMovimentoEstoqueId: string;
};

export type CreateStockCorrectionInput = {
  produtoId: string;
  tipoMovimentoEstoqueId: string;
  quantidade: number;
  valorUnitario: number;
};

export type UpdateStockCorrectionInput = {
  produtoId: string;
  tipoMovimentoEstoqueId: string;
  quantidade: number;
  valorUnitario: number;
};

export type StockCorrectionDetail = Omit<StockCorrection, 'id'>;
