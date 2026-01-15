// app/stock-correction/api/use-get-stock-corrections.tsx

import { useQuery } from '@tanstack/react-query';
import StockCorrectionsApi from '@/api/stock-correction.api';

type Params = {
  pagina?: number;
  q?: string;
  totalPagina?: number;
  sortField?: string;
  sortDirection?: string;
};

export function useGetStockCorrections({
  pagina,
  q,
  totalPagina,
  sortField,
  sortDirection,
}: Params = {}) {
  return useQuery({
    queryKey: ['getStockCorrections', [{ pagina, q, totalPagina, sortField, sortDirection }]],
    queryFn: async ({ signal }) => {
      return StockCorrectionsApi.getStockCorrections(
        { pagina, q, totalPagina, sortField, sortDirection },
        { signal }
      );
    },
  });
}