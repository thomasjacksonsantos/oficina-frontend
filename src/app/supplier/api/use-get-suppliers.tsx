import { useQuery } from '@tanstack/react-query';
import SuppliersApi from '@/api/supplier.api';
import { getMockSuppliersPage } from '../mock-data';

type Params = {
  page?: number;
  q?: string;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  fornecedorStatus?: string;
};

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = false;

export function useGetSuppliers({ page, q, limit, sortField, sortDirection, fornecedorStatus }: Params = {}) {
  return useQuery({
    queryKey: ['getSuppliers', [{ page, q, limit, sortField, sortDirection, fornecedorStatus }]],
    queryFn: async ({ signal }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Check if query was cancelled
        if (signal?.aborted) {
          throw new Error('Query cancelled');
        }

        return getMockSuppliersPage({ page, q, limit, sortField, sortDirection, fornecedorStatus });
      }

      return SuppliersApi.getSuppliers(
        { page, q, limit, sortField, sortDirection, fornecedorStatus },
        { signal }
      );
    },
  });
}
