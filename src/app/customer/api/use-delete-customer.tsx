import CustomersApi from "@/api/customers.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CustomersApi.deleteCustomer(id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getCustomers'],
      });
    },
    onError: (error) => {
      console.error("Erro ao deletar cliente:", error);
    },
  })
}

