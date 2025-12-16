// app/product-unit/api/use-deactive-product-unit.tsx

import UnitsApi from '@/api/product-unit.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactiveUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UnitsApi.deactiveUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getUnits'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar unidade:', error);
    },
  });
}