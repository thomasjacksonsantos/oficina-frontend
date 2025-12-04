import BandeirasCartaoApi from "@/api/bandeira-cartao.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteBandeiraCartao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BandeirasCartaoApi.deleteBandeiraCartao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getBandeirasCartao'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar bandeira de cartão:', error);
    },
  });
}