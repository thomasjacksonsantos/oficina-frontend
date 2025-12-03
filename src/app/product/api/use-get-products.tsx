import { useQuery } from "@tanstack/react-query";
import ProductsApi from "@/api/product.api";

type Params = {
  page?: number
  q?: string
  limit?: number
  sortField?: string
  sortDirection?: string
  status?: string
  grupo?: string
  marca?: string
}

export function useGetProducts(
  { page, q, limit, sortField, sortDirection, status, grupo, marca }: Params = {}
) {
  return useQuery({
    queryKey: ['getProducts', [{ page, q, limit, sortField, sortDirection, status, grupo, marca }]],
    queryFn: async ({ signal }) => {
      return ProductsApi.getProducts({ page, q, limit, sortField, sortDirection, status, grupo, marca }, { signal });
    },
  });
}