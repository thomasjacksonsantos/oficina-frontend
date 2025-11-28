import AreasApi from "@/api/area.api";
import { CreateAreaInput } from "@/api/area.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (area: CreateAreaInput) => 
      AreasApi.createArea(area),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getAreas'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar área:", error);
    },
  })
}
