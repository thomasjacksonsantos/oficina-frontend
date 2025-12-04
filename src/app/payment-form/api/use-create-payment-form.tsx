import PaymentFormsApi from "@/api/payment-form.api";
import { CreatePaymentFormInput } from "@/api/payment-form.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePaymentForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentForm: CreatePaymentFormInput) => 
      PaymentFormsApi.createPaymentForm(paymentForm),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getPaymentForms'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar forma de pagamento:", error);
    },
  })
}