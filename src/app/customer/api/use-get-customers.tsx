import { useQuery } from "@tanstack/react-query";
import CustomersApi from "@/api/customers.api";

type Params = {
  page?: number
  q?: string
  limit?: number
  sortField?: string
  sortDirection?: string
  status?: string
  priority?: string
}

export function useGetCustomers(
  { page, q, limit, sortField, sortDirection, status, priority }: Params = {}
) {
  return useQuery({
    queryKey: ['getCustomers', [{ page, q, limit, sortField, sortDirection, status, priority }]],
    queryFn: async ({ signal }) => {     
      return CustomersApi.getCustomers({ page, q, limit, sortField, sortDirection, status, priority }, { signal });
    },
  });
}

