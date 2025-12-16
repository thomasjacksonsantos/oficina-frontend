// app/product-orderStatus/api/use-delete-product-orderStatus.tsx

import OrderStatussApi from '@/api/product-orderStatus.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => OrderStatussApi.deleteOrderStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getOrderStatuss'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar unidade:', error);
    },
  });
}