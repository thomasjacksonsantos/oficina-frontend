import BandeirasCartaoApi from "@/api/bandeira-cartao.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeactiveBandeiraCartao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BandeirasCartaoApi.deactiveBandeiraCartao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getBandeirasCartao'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar bandeira de cartão:', error);
    },
  });
}