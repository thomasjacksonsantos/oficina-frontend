import ProductsApi from '@/api/product.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return ProductsApi.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProducts'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar produto:', error);
    },
  });
}
