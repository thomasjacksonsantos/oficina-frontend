import { UpdateBandeiraCartaoInput } from "@/api/bandeira-cartao.types";
import BandeirasCartaoApi from "@/api/bandeira-cartao.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateBandeiraCartao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, bandeiraCartao }: { id: string, bandeiraCartao: UpdateBandeiraCartaoInput }) =>
      BandeirasCartaoApi.updateBandeiraCartao(bandeiraCartao, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getBandeirasCartao'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getBandeiraCartao', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar bandeira de cartão:", error);
    },
  });
}