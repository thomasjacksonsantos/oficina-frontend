import SuppliersApi from '@/api/supplier.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactiveMockSupplier } from '../mock-data';

const USE_MOCK_DATA = false;

export function useDeactiveSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const result = deactiveMockSupplier(id);
        if (!result) throw new Error('Fornecedor não encontrado');
        return;
      }
      return SuppliersApi.deactiveSupplier(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getSuppliers'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar fornecedor:', error);
    },
  });
}
