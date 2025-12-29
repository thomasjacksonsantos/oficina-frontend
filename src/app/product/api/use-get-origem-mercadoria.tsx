import { useQuery } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';

export function useGetOrigemMercadoria() {
  return useQuery({
    queryKey: ['getOrigemMercadoria'],
    queryFn: () => ProductsApi.getOrigemMercadoria(),
  });
}
