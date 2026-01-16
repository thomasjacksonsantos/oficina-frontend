// app/store-transfer/api/use-get-store-transfer-by-id.tsx

import { useQuery } from '@tanstack/react-query';
import StoreTransfersApi from '@/api/store-transfer.api';

export function useGetStoreTransferById(id: string | null) {
  return useQuery({
    queryKey: ['getStoreTransfer', id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      return StoreTransfersApi.getStoreTransferById(id);
    },
    enabled: !!id,
  });
}