import ManualEntryApi from '@/api/manual-entry.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactiveManualEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ManualEntryApi.deactiveManualEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getManualEntries'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar entrada manual:', error);
    },
  });
}