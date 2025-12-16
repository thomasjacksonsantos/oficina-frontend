// app/product-marca/api/use-active-product-marca.tsx

import MarcasApi from '@/api/product-marca.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActiveMarca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MarcasApi.activeMarca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMarcas'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar unidade:', error);
    },
  });
}