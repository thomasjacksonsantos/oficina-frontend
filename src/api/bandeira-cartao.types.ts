export type BandeiraCartao = {
  id: string;
  descricao: string;
  planoContaRecebimento: string;
  formaPagamento: string;
  banco: {
    nome: string;
  };
  status?: string;
};

export type CreateBandeiraCartaoInput = Omit<BandeiraCartao, 'id' | 'status'> & {
  id?: string;
};

export type UpdateBandeiraCartaoInput = Partial<CreateBandeiraCartaoInput>;
