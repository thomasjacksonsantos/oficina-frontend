// app/product-unit/api/use-create-product-unit.tsx

import UnitsApi from "@/api/product-unit.api";
import { CreateUnitInput } from "@/api/product-unit.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unit: CreateUnitInput) => 
      UnitsApi.createUnit(unit),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getUnits'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar unidade:", error);
    },
  })
}