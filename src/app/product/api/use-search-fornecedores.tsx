import { useQuery } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';
import type { Fornecedor } from '@/api/product.types';

export function useSearchFornecedores(nome?: string) {
  return useQuery<Fornecedor[]>({
    queryKey: ['searchFornecedores', nome],
    queryFn: () => ProductsApi.searchFornecedores(nome),
    enabled: nome !== undefined && nome.length > 0,
  });
}
