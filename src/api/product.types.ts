export type Product = {
  id: string;
  descricao: string;
  aplicacao: string;
  referencia: string;
  codigoBarra: string;
  marca: string;
  grupo?: string | undefined;
  observacao: string;
  status?: string;
  dadosComplementares: {
    fornecedor: string;
    endereco: string;
    statusProduto: 'Ativo' | 'Desativo';
    estoque: number;
    tipoUnidade: string;
  };
  dadosFiscalProduto: {
    origemMercadoria: string;
    NCM: string;
    ANP: string;
    regraEspecificaParaEsteItem: string;
  };
  preco: {
    compra: number;
    venda: number;
    custo: number;
    compraFixo: number;
    dataCompra: string;
    dataVenda: string;
    dataCusto: string;
    dataCompraFixo: string;
  };
  markup: {
    produto: number;
    grupo: number;
  };
};


export type CreateProductInput = Omit<Product, 'id' | 'status'> & {
  id?: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;
