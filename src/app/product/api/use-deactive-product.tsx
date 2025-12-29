import ProductsApi from '@/api/product.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return ProductsApi.deactiveProduct(id);
    },
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
