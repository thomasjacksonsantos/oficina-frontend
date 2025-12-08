import SuppliersApi from '@/api/supplier.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useGetSupplier() {
  return useMutation({
    mutationFn: async (id: string) => {
      return SuppliersApi.getSupplierById(id);
    },
  });
}