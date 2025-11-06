import ServiceOrdersApi from "@/api/service-orders.api";
import { UpdateServiceOrderInput } from "@/api/service-orders.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateServiceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, serviceOrder }: { id: string; serviceOrder: UpdateServiceOrderInput }) =>
      ServiceOrdersApi.updateServiceOrder(id, serviceOrder),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getServiceOrders'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getServiceOrder', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar ordem de serviço:", error);
    },
  })
}

