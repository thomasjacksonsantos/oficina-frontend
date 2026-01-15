// app/stock-correction/api/use-update-stock-correction.tsx

import StockCorrectionsApi from "@/api/stock-correction.api";
import { UpdateStockCorrectionInput } from "@/api/stock-correction.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateStockCorrection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stockCorrection: UpdateStockCorrectionInput) =>
      StockCorrectionsApi.updateStockCorrection(stockCorrection),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getStockCorrections'],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar correção de estoque:", error);
    },
  })
}