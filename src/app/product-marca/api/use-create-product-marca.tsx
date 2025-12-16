// app/product-marca/api/use-create-product-marca.tsx

import MarcasApi from "@/api/product-marca.api";
import { CreateMarcaInput } from "@/api/product-marca.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMarca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (marca: CreateMarcaInput) => 
      MarcasApi.createMarca(marca),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMarcas'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar unidade:", error);
    },
  })
}