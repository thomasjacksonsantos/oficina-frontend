export type Area = {
  id: string;
  codigo: string;
  descricao: string;
  descricaoEstendida: string;
  garantia: string;
  status?: string;
};

export type CreateAreaInput = Omit<Area, 'id' | 'status'> & {
  id?: string;
};

export type UpdateAreaInput = Partial<CreateAreaInput>;
