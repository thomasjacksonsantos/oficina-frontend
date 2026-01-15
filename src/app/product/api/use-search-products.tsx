import { useQuery } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';
import type { Product } from '@/api/product.types';

export function useSearchProducts(descricao?: string) {
  return useQuery<Product[]>({
    queryKey: ['searchProducts', descricao],
    queryFn: () => ProductsApi.searchProducts(descricao),
    // Only enable when we have at least 3 characters to avoid excessive calls
    enabled: descricao !== undefined && descricao.trim().length >= 3,
  });
}
