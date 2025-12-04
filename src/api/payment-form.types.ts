export type PaymentForm = {
  id: string;
  descricao: string;
  numeroParcela: number;
  tipoPagamento: string;
  planoParcelamento: string;
  status?: string;
};

export type CreatePaymentFormInput = Omit<PaymentForm, 'id' | 'status'> & {
  id?: string;
};

export type UpdatePaymentFormInput = Partial<CreatePaymentFormInput>;
