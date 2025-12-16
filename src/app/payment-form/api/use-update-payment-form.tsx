import PaymentFormsApi from "@/api/payment-form.api";
import { UpdatePaymentFormInput } from "@/api/payment-form.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatePaymentForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paymentForm }: { id: string, paymentForm: UpdatePaymentFormInput }) =>
      PaymentFormsApi.updatePaymentForm(paymentForm, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getPaymentForms'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getPaymentForm', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar forma de pagamento:", error);
    },
  })
}