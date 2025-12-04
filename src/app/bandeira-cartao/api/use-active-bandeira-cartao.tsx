import BandeirasCartaoApi from "@/api/bandeira-cartao.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useActiveBandeiraCartao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BandeirasCartaoApi.activeBandeiraCartao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getBandeirasCartao'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar bandeira de cartão:', error);
    },
  });
}