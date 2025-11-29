// app/product-unit/api/use-delete-product-unit.tsx

import UnitsApi from '@/api/product-unit.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UnitsApi.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getUnits'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar unidade:', error);
    },
  });
}