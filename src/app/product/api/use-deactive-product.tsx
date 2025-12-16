import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';

export function useDeactiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductsApi.deactiveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProducts'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar produto:', error);
    },
  });
}