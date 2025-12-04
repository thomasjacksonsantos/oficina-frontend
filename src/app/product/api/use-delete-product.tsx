import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductsApi.deleteProduct(id),
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