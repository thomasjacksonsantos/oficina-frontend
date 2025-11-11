import customersApi from "@/api/customers.api";
import { CreateCustomerInput } from "@/api/customers.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: CreateCustomerInput) =>
      customersApi.createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getCustomers'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar cliente:", error);
    },
  })
}

  