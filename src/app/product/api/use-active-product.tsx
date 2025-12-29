import ProductsApi from '@/api/product.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return ProductsApi.activeProduct(id);
    },
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
