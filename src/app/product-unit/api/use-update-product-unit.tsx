// app/product-unit/api/use-update-product-unit.tsx

import UnitsApi from "@/api/product-unit.api";
import { UpdateUnitInput } from "@/api/product-unit.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, unit }: { id: string, unit: UpdateUnitInput }) =>
      UnitsApi.updateUnit(unit, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getUnits'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getUnit', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar unidade:", error);
    },
  })
}