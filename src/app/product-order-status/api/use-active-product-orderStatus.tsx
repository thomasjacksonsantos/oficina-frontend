// app/product-orderStatus/api/use-active-product-orderStatus.tsx

import OrderStatussApi from '@/api/product-orderStatus.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActiveOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => OrderStatussApi.activeOrderStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getOrderStatuss'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar unidade:', error);
    },
  });
}