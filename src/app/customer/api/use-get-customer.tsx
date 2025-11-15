import { useQuery } from "@tanstack/react-query";
import CustomersApi from "@/api/customers.api";

export function useGetCustomer(id: number) {
  return useQuery({
    queryKey: ['getCustomer', id],
    queryFn: ({ signal }) => CustomersApi.getCustomerById(id.toString()),
    enabled: !!id,
  });
}

