import ManualEntryApi from '@/api/manual-entry.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActiveManualEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ManualEntryApi.activeManualEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getManualEntries'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar entrada manual:', error);
    },
  });
}