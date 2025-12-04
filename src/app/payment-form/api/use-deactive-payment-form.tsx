import PaymentFormsApi from '@/api/payment-form.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactivePaymentForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PaymentFormsApi.deactivePaymentForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getPaymentForms'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar forma de pagamento:', error);
    },
  });
}