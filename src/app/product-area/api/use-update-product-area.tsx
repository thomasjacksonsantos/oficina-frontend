import AreasApi from "@/api/area.api";
import { UpdateAreaInput } from "@/api/area.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, area }: { id: string, area: UpdateAreaInput }) =>
      AreasApi.updateArea(area, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getAreas'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getArea', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar área:", error);
    },
  })
}
