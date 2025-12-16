import ProductGroupsApi from "@/api/product-group.api";
import { CreateProductGroupInput } from "@/api/product-group.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProductGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productGroup: CreateProductGroupInput) => 
      ProductGroupsApi.createProductGroup(productGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProductGroups'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar grupo de produto:", error);
    },
  })
}
