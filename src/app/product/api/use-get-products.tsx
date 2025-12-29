import { useQuery } from '@tanstack/react-query';
import ProductsApi from '@/api/product.api';

type Params = {
  page?: number;
  q?: string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  // Use the correct property name in Portuguese for the hook param
  produtoStatus?: string;
  // Support both legacy names and explicit id params
  grupoProduto?: string;
  unidadeProduto?: string;
  grupoProdutoId?: string;
  unidadeProdutoId?: string;
};

export function useGetProducts({
  page,
  q,
  limit,
  sortField,
  sortDirection,
  produtoStatus,
  grupoProduto,
  unidadeProduto,
  grupoProdutoId,
  unidadeProdutoId,
}: Params = {}) {
  // Resolve id params, prefer explicit Ids but fall back to legacy values
  const resolvedGrupoId = grupoProdutoId || grupoProduto;
  const resolvedUnidadeId = unidadeProdutoId || unidadeProduto;

  return useQuery({
    queryKey: [
      'getProducts',
      [
        {
          page,
          q,
          limit,
          sortField,
          sortDirection,
          productoStatus: produtoStatus,
          grupoProdutoId: resolvedGrupoId,
          unidadeProdutoId: resolvedUnidadeId,
        },
      ],
    ],
    queryFn: async ({ signal }) => {
      return ProductsApi.getProducts(
        {
          page,
          q,
          limit,
          sortField,
          sortDirection,
          productoStatus: produtoStatus,
          grupoProdutoId: resolvedGrupoId,
          unidadeProdutoId: resolvedUnidadeId,
        },
        { signal }
      );
    },
  });
}
