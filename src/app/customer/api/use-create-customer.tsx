
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCustomerInput, Customer } from "@/api/customers.types";
import customersApi from "@/api/customers.api";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: CreateCustomerInput) =>
      customersApi.createCustomer(customer),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getCustomers'],
      });
    }
  });
}

