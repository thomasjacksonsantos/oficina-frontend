export type ProductGroup = {
  id: string;
  descricao: string;
  area: string;
  ncm: string;
  anp: string;
  status?: string;
};

export type CreateProductGroupInput = Omit<ProductGroup, 'id' | 'status'> & {
  id?: string;
};

export type UpdateProductGroupInput = Partial<CreateProductGroupInput>;
