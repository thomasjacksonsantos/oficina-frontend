import ManualEntryApi from "@/api/manual-entry.api";
import { UpdateManualEntryInput } from "@/api/manual-entry.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateManualEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, entry }: { id: string, entry: UpdateManualEntryInput }) =>
      ManualEntryApi.updateManualEntry(entry, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getManualEntries'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getManualEntry', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar entrada manual:", error);
    },
  })
}