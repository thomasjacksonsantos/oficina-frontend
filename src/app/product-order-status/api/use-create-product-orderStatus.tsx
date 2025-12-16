// app/product-orderStatus/api/use-create-product-orderStatus.tsx

import OrderStatussApi from "@/api/product-orderStatus.api";
import { CreateOrderStatusInput } from "@/api/product-orderStatus.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderStatus: CreateOrderStatusInput) => 
      OrderStatussApi.createOrderStatus(orderStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getOrderStatuss'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar unidade:", error);
    },
  })
}