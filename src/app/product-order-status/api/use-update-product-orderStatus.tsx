// app/product-orderStatus/api/use-update-product-orderStatus.tsx

import OrderStatussApi from "@/api/product-orderStatus.api";
import { UpdateOrderStatusInput } from "@/api/product-orderStatus.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, orderStatus }: { id: string, orderStatus: UpdateOrderStatusInput }) =>
      OrderStatussApi.updateOrderStatus(orderStatus, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getOrderStatuss'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getOrderStatus', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar unidade:", error);
    },
  })
}