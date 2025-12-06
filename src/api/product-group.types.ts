export type ProductGroup = {
  id: string;
  descricao: string;
  area: string;
  ncm: string;
  anp: string;
  grupoProdutoStatus?: string;
};

export type CreateProductGroupInput = Omit<ProductGroup, 'id' | 'grupoProdutoStatus'> & {
  id?: string;
};

export type UpdateProductGroupInput = Partial<CreateProductGroupInput>;
