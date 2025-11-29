// app/product-unit/api/use-active-product-unit.tsx

import UnitsApi from '@/api/product-unit.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActiveUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UnitsApi.activeUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getUnits'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar unidade:', error);
    },
  });
}