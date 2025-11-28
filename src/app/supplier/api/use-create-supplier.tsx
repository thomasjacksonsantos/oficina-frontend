import SuppliersApi from '@/api/supplier.api';
import { CreateSupplierInput } from '@/api/supplier.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMockSupplier } from '../mock-data';

const USE_MOCK_DATA = true;

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplier: CreateSupplierInput) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return createMockSupplier(supplier as any);
      }
      return SuppliersApi.createSupplier(supplier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getSuppliers'],
      });
    },
    onError: (error) => {
      console.error('Erro ao criar fornecedor:', error);
    },
  });
}
