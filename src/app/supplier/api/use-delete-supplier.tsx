import SuppliersApi from '@/api/supplier.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMockSupplier } from '../mock-data';

const USE_MOCK_DATA = false;

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const result = deleteMockSupplier(id);
        if (!result) throw new Error('Fornecedor não encontrado');
        return;
      }
      return SuppliersApi.deleteSupplier(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getSuppliers'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar fornecedor:', error);
    },
  });
}
