// api/store-transfer.types.ts

export type StoreTransfer = {
  id: string;
  origem: string;
  destino: string;
  data: string;
  codProduto: string;
  descricao: string;
  quantidade: number;
  movimentoEntrada: {
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  };
  movimentoSaida: {
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  };
};

export type StoreTransferDetail = {
  origemId: string;
  origem: string;
  destinoId: string;
  destino: string;
  data: string;
  produtoId: string;
  descricao: string;
  movimentoEntrada: {
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  };
  movimentoSaida: {
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  };
};

export type CreateStoreTransferInput = {
  lojaOrigemId: string;
  lojaDestinoId: string;
  produtoId: string;
  quantidade: number;
};

export type UpdateStoreTransferInput = {
  id: string;
  lojaOrigemId: string;
  lojaDestinoId: string;
  produtoId: string;
  quantidade: number;
};

export type StoreInfo = {
  id: string;
  nomeFantasia: string;
};
