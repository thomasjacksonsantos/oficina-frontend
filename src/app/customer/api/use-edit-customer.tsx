
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCustomerInput } from "@/api/customers.types";
import customersApi from "@/api/customers.api";

export function useEditCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: UpdateCustomerInput) =>      
      customersApi.updateCustomer(customer.id!, customer),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['getCustomers'],
      });
    }
  });
}

