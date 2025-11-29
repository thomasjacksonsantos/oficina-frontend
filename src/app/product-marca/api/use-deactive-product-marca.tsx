// app/product-marca/api/use-deactive-product-marca.tsx

import MarcasApi from '@/api/product-marca.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactiveMarca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MarcasApi.deactiveMarca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMarcas'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar unidade:', error);
    },
  });
}