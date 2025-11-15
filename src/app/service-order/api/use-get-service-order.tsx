import { useQuery } from "@tanstack/react-query";
import ServiceOrdersApi from "@/api/service-orders.api";

export function useGetServiceOrder(id: number) {
  return useQuery({
    queryKey: ['getServiceOrder', id],
    queryFn: ({ signal }) => ServiceOrdersApi.getServiceOrderById(id.toString()),
    enabled: !!id,
  });
}

