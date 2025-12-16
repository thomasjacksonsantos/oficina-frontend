import ProductGroupsApi from '@/api/product-group.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactiveProductGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductGroupsApi.deactiveProductGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProductGroups'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar grupo de produto:', error);
    },
  });
}
