import ServiceOrdersApi from "@/api/service-orders.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteServiceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ServiceOrdersApi.deleteServiceOrder(id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getServiceOrders'],
      });
    },
    onError: (error) => {
      console.error("Erro ao deletar ordem de serviço:", error);
    },
  })
}

