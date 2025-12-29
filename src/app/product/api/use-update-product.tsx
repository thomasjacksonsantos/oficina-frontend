import ProductsApi from '@/api/product.api';
import { UpdateProductInput } from '@/api/product.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product }: { id: string; product: UpdateProductInput }) => {
      return ProductsApi.updateProduct(product, id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getProducts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getProduct', variables.id],
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar produto:', error);
    },
  });
}
