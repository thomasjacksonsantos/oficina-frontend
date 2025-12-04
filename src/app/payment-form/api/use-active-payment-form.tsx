import PaymentFormsApi from '@/api/payment-form.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActivePaymentForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PaymentFormsApi.activePaymentForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getPaymentForms'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar forma de pagamento:', error);
    },
  });
}