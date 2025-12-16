export type Area = {
  id: string;
  descricao: string;
  garantia: string;
  areaProdutoStatus?: string;
};

export type CreateAreaInput = Omit<Area, 'id' | 'status'> & {
  id?: string;
};

export type UpdateAreaInput = Partial<CreateAreaInput>;
