import ManualEntryApi from '@/api/manual-entry.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteManualEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ManualEntryApi.deleteManualEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getManualEntries'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar entrada manual:', error);
    },
  });
}