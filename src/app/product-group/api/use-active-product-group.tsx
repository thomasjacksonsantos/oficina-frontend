import ProductGroupsApi from '@/api/product-group.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActiveProductGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductGroupsApi.activeProductGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProductGroups'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar grupo de produto:', error);
    },
  });
}
