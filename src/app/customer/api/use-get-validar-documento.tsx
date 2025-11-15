import { useQuery } from "@tanstack/react-query";
import UsersApi from "@/api/users.api";

export function useGetValidarDocumento(documento: string) {
  return useQuery({
    queryKey: ['getValidarDocumento', documento],
    queryFn: ({ signal }) => UsersApi.getValidarDocumento(documento),
    enabled: !!documento,
  });
}

