// app/entrada-chave-acesso/api/use-get-notas-fiscais.tsx

import { useQuery } from '@tanstack/react-query';
import EntradaChaveAcessoApi from '@/api/entrada-chave-acesso.api';

type Params = {
  page?: number;
  q?: Record<string, any> | string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
};

export function useGetNotasFiscais({ page, q, limit, sortField, sortDirection }: Params = {}) {
  return useQuery({
    queryKey: ['getNotasFiscais', [{ page, q, limit, sortField, sortDirection }]],
    queryFn: async ({ signal }) => {
      return EntradaChaveAcessoApi.getNotasFiscais(
        { page, q, limit, sortField, sortDirection },
        { signal }
      );
    },
  });
}
