import ProductGroupsApi from '@/api/product-group.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteProductGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductGroupsApi.deleteProductGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProductGroups'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar grupo de produto:', error);
    },
  });
}
