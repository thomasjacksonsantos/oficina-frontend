// app/stock-correction/api/use-create-stock-correction.tsx

import StockCorrectionsApi from "@/api/stock-correction.api";
import { CreateStockCorrectionInput } from "@/api/stock-correction.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateStockCorrection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stockCorrection: CreateStockCorrectionInput) => 
      StockCorrectionsApi.createStockCorrection(stockCorrection),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getStockCorrections'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar correção de estoque:", error);
    },
  })
}