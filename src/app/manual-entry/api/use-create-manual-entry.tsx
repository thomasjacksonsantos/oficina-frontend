import ManualEntryApi from "@/api/manual-entry.api";
import { CreateManualEntryInput } from "@/api/manual-entry.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateManualEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: CreateManualEntryInput) => 
      ManualEntryApi.createManualEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getManualEntries'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar entrada manual:", error);
    },
  })
}