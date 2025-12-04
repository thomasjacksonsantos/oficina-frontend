import BandeirasCartaoApi from "@/api/bandeira-cartao.api";
import { CreateBandeiraCartaoInput } from "@/api/bandeira-cartao.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBandeiraCartao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bandeiraCartao: CreateBandeiraCartaoInput) => 
      BandeirasCartaoApi.createBandeiraCartao(bandeiraCartao),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getBandeirasCartao'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar bandeira de cartão:", error);
    },
  });
}