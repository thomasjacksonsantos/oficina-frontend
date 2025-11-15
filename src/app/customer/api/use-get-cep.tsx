import { useQuery } from "@tanstack/react-query";
import CepApi from "@/api/cep.api";

export function useGetCep(cep: string) {
  return useQuery({
    queryKey: ['getCep', cep],
    queryFn: ({ signal }) => CepApi.getCep(cep),
    enabled: !!cep,
  });
}

