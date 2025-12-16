import { useQuery } from "@tanstack/react-query";
import ServiceOrdersApi from "@/api/service-orders.api";

type Params = {
  page?: number
  q?: string
  limit?: number
  sortField?: string
  sortDirection?: string
  status?: string
  priority?: string
}

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = true;

export function useGetServiceOrders(
  { page, q, limit, sortField, sortDirection, status, priority }: Params = {}
) {
  return useQuery({
    queryKey: ['getServiceOrders', [{ page, q, limit, sortField, sortDirection, status, priority }]],
    queryFn: async ({ signal }) => {      
      return ServiceOrdersApi.getServiceOrders({ page, q, limit, sortField, sortDirection, status, priority }, { signal });
    },
  });
}

