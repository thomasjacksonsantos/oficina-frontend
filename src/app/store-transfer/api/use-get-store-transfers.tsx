// app/store-transfer/api/use-get-store-transfers.tsx

import { useQuery } from '@tanstack/react-query';
import StoreTransfersApi from '@/api/store-transfer.api';

type Params = {
  pagina?: number;
  q?: string;
  totalPagina?: number;
  sortField?: string;
  sortDirection?: string;
  lojaOrigemId?: string;
  lojaDestinoId?: string;
  dataInicio?: string;
  dataFim?: string;
};

export function useGetStoreTransfers({
  pagina,
  q,
  totalPagina,
  sortField,
  sortDirection,
  lojaOrigemId,
  lojaDestinoId,
  dataInicio,
  dataFim,
}: Params = {}) {
  return useQuery({
    queryKey: [
      'getStoreTransfers',
      [
        {
          pagina,
          q,
          totalPagina,
          sortField,
          sortDirection,
          lojaOrigemId,
          lojaDestinoId,
          dataInicio,
          dataFim,
        },
      ],
    ],
    queryFn: async ({ signal }) => {
      return StoreTransfersApi.getStoreTransfers(
        {
          pagina,
          q,
          totalPagina,
          sortField,
          sortDirection,
          lojaOrigemId,
          lojaDestinoId,
          dataInicio,
          dataFim,
        },
        { signal }
      );
    },
  });
}