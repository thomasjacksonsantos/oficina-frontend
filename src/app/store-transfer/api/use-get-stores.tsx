// app/store-transfer/api/use-get-stores.tsx

import { useQuery } from '@tanstack/react-query';
import StoreTransfersApi from '@/api/store-transfer.api';

export function useGetStores() {
  return useQuery({
    queryKey: ['getStores'],
    queryFn: async () => {
      return StoreTransfersApi.getAllStores();
    },
  });
}