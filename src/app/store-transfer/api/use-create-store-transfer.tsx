// app/store-transfer/api/use-create-store-transfer.tsx

import StoreTransfersApi from '@/api/store-transfer.api';
import { CreateStoreTransferInput } from '@/api/store-transfer.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateStoreTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeTransfer: CreateStoreTransferInput) =>
      StoreTransfersApi.createStoreTransfer(storeTransfer),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getStoreTransfers'],
      });
    },
    onError: (error) => {
      console.error('Erro ao criar transferência de estoque:', error);
    },
  });
}