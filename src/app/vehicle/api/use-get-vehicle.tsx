import { useQuery } from "@tanstack/react-query";
import VehiclesApi from "@/api/vehicle.api";
// import { getMockVehiclesPage } from "../mock-data";

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
const USE_MOCK_DATA = false;

export function useGetVehicles(
  { page, q, limit, sortField, sortDirection, status, priority }: Params = {}
) {
  return useQuery({
    queryKey: ['getVehicles', [{ page, q, limit, sortField, sortDirection, status, priority }]],
    queryFn: async ({ signal }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if query was cancelled
        if (signal?.aborted) {
          throw new Error('Query cancelled');
        }
        
        // return getMockVehiclesPage({ page, q, limit, sortField, sortDirection, status, priority });
      }
      
      return VehiclesApi.getVehicles({ page, q, limit, sortField, sortDirection, status, priority }, { signal });
    },
  });
}

