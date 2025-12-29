import ProductsApi from '@/api/product.api';
import { useMutation } from '@tanstack/react-query';

export function useGetProduct() {
  return useMutation({
    mutationFn: async (id: string) => {
      return ProductsApi.getProductById(id);
    },
  });
}
