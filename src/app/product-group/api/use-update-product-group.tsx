import ProductGroupsApi from "@/api/product-group.api";
import { UpdateProductGroupInput } from "@/api/product-group.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProductGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, productGroup }: { id: string, productGroup: UpdateProductGroupInput }) =>
      ProductGroupsApi.updateProductGroup(productGroup, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getProductGroups'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getProductGroup', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar grupo de produto:", error);
    },
  })
}
