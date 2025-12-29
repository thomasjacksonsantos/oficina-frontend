import { useQuery } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';
import type { GrupoProduto } from '@/api/product.types';

export function useSearchGruposProdutos(nome?: string) {
  return useQuery<GrupoProduto[]>({
    queryKey: ['searchGruposProdutos', nome],
    queryFn: () => ProductsApi.searchGruposProdutos(nome),
    enabled: nome !== undefined && nome.length > 0,
  });
}

export function useGetAllGruposProdutos() {
  return useQuery<GrupoProduto[]>({
    queryKey: ['getAllGruposProdutos'],
    queryFn: () => ProductsApi.getAllGruposProdutos(),
  });
}
