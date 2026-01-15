export type Product = {
  id: string;
  referencia: string;
  descricao?: string;
  grupoProduto: string;
  unidadeProduto: string;
  fornecedorId?: string;
  ncm?: string;
  origemMercadoria?: string;
  observacao?: string;
  produtoStatus: ProductStatus;
  creado: string;
  actualizado: string;
  quantidade?: number;
  valorUnitario?: number;
  total?: number;
};

export type ProductStatus = {
  id: string;
  key: string;
  nome: string;
  dominio: string;
};

export type GrupoProduto = {
  id: string;
  descricao: string;
  area?: string;
  ncm?: string;
  anp?: string;
  grupoProdutoStatus?: string;
  criado?: string; // ISO datetime
  atualizado?: string; // ISO datetime
};

export type UnidadeProduto = {
  id: string;
  descricao: string;
  criado?: string; // ISO datetime
  atualizado?: string; // ISO datetime
};

export type OrigemMercadoria = {
  key: string;
  nome: string;
};

export type Fornecedor = {
  id: string;
  nome: string;
};

export type StatusOption = {
  key: string;
  nome: string;
};

export type CreateProductInput = {
  descricao: string;
  grupoProdutoId: string;
  fornecedorId: string;
  referencia: string;
  unidadeProdutoId: string;
  origemMercadoria: string;
  ncm: string;
  observacao?: string;
};

export type UpdateProductInput = {
  id: string;
  descricao: string;
  grupoProduto: string;
  fornecedorId: string;
  referencia: string;
  unidadeProduto: string;
  produtoStatus: string;
  origemMercadoria: string;
  ncm: string;
  observacao?: string;
};
