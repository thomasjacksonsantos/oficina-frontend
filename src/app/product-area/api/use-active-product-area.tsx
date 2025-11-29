import AreasApi from '@/api/area.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActiveArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AreasApi.activeArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getAreas'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar área:', error);
    },
  });
}
