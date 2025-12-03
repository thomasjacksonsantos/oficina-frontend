import { useQuery } from "@tanstack/react-query";
import CustomersApi from "@/api/customers.api";

type Params = {
  pagina?: number
  q?: string
  totalPagina?: number
  sortField?: string
  sortDirection?: string
  status?: string
  priority?: string
}

export function useGetCustomers(
  { pagina, q, totalPagina, sortField, sortDirection, status, priority }: Params = {}
) {
  return useQuery({
    queryKey: ['getCustomers', [{ pagina, q, totalPagina, sortField, sortDirection, status, priority }]],
    queryFn: async ({ signal }) => {     
      return CustomersApi.getCustomers({ pagina, q, totalPagina, sortField, sortDirection, status, priority }, { signal });
    },
  });
}

