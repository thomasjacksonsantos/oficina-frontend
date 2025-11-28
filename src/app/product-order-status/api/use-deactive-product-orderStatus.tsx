// app/product-orderStatus/api/use-deactive-product-orderStatus.tsx

import OrderStatussApi from '@/api/product-orderStatus.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactiveOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => OrderStatussApi.deactiveOrderStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getOrderStatuss'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar unidade:', error);
    },
  });
}