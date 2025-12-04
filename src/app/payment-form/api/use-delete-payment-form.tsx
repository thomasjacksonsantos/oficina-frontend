import PaymentFormsApi from '@/api/payment-form.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeletePaymentForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PaymentFormsApi.deletePaymentForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getPaymentForms'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar forma de pagamento:', error);
    },
  });
}