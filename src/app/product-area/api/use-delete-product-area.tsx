import AreasApi from '@/api/area.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AreasApi.deleteArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getAreas'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar área:', error);
    },
  });
}
