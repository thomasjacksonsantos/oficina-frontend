// app/product-marca/api/use-delete-product-marca.tsx

import MarcasApi from '@/api/product-marca.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteMarca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MarcasApi.deleteMarca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMarcas'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar unidade:', error);
    },
  });
}