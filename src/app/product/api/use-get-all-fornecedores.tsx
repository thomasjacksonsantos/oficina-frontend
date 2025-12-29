import { useQuery } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';
import type { Fornecedor } from '@/api/product.types';

export function useGetAllFornecedores() {
  return useQuery<Fornecedor[]>({
    queryKey: ['getAllFornecedores'],
    queryFn: () => ProductsApi.getAllFornecedores(),
  });
}
