// app/stock-correction/api/use-get-stock-correction-by-id.tsx

import { useQuery } from '@tanstack/react-query';
import StockCorrectionsApi from '@/api/stock-correction.api';

export function useGetStockCorrectionById(id: string | null) {
  return useQuery({
    queryKey: ['getStockCorrection', id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      return StockCorrectionsApi.getStockCorrectionById(id);
    },
    enabled: !!id,
  });
}
