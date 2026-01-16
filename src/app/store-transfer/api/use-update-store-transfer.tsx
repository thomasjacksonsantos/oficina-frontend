// app/store-transfer/api/use-update-store-transfer.tsx

import StoreTransfersApi from '@/api/store-transfer.api';
import { UpdateStoreTransferInput } from '@/api/store-transfer.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateStoreTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeTransfer: UpdateStoreTransferInput) =>
      StoreTransfersApi.updateStoreTransfer(storeTransfer),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getStoreTransfers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getStoreTransferById'],
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar transferência de estoque:', error);
    },
  });
}
