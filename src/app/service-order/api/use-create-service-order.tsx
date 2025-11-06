import ServiceOrdersApi from "@/api/service-orders.api";
import { CreateServiceOrderInput } from "@/api/service-orders.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateServiceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceOrder: CreateServiceOrderInput) => 
      ServiceOrdersApi.createServiceOrder(serviceOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getServiceOrders'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar ordem de serviço:", error);
    },
  })
}

