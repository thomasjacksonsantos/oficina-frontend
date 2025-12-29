import { useQuery } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';

export function useGetProductStatus() {
  return useQuery({
    queryKey: ['getProductStatus'],
    queryFn: () => ProductsApi.getProductStatus(),
  });
}
