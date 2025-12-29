import ProductsApi from '@/api/product.api';
import { CreateProductInput } from '@/api/product.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: CreateProductInput) => {
      return ProductsApi.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProducts'],
      });
    },
    onError: (error) => {
      console.error('Erro ao criar produto:', error);
    },
  });
}
