import CustomersApi from "@/api/customers.api";
import { UpdateCustomerInput, CreateCustomerInput } from "@/api/customers.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customer }: { id: string; customer: UpdateCustomerInput }) =>
      CustomersApi.updateCustomer(id, customer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getCustomers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getCustomer', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar cliente:", error);
    },
  })
}

