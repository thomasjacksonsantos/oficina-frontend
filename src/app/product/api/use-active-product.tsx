import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';

export function useActiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductsApi.activeProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProducts'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar produto:', error);
    },
  });
}