// app/product-marca/api/use-update-product-marca.tsx

import MarcasApi from "@/api/product-marca.api";
import { UpdateMarcaInput } from "@/api/product-marca.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateMarca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, marca }: { id: string, marca: UpdateMarcaInput }) =>
      MarcasApi.updateMarca(marca, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getMarcas'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getMarca', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar unidade:", error);
    },
  })
}