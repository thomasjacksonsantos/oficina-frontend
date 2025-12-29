import { useQuery } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';
import type { UnidadeProduto } from '@/api/product.types';

export function useSearchUnidadesProdutos(nome?: string) {
  return useQuery<UnidadeProduto[]>({
    queryKey: ['searchUnidadesProdutos', nome],
    queryFn: () => ProductsApi.searchUnidadesProdutos(nome),
    enabled: nome !== undefined && nome.length > 0,
  });
}

export function useGetAllUnidadesProdutos() {
  return useQuery<UnidadeProduto[]>({
    queryKey: ['getAllUnidadesProdutos'],
    queryFn: () => ProductsApi.getAllUnidadesProdutos(),
  });
}
