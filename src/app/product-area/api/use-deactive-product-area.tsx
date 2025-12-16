import AreasApi from '@/api/area.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactiveArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AreasApi.deactiveArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getAreas'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar área:', error);
    },
  });
}
