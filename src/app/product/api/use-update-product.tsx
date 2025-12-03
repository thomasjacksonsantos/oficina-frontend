import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProductsApi from "@/api/product.api";
import { UpdateProductInput } from "@/api/product.types";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string, product: UpdateProductInput }) =>
      ProductsApi.updateProduct(product, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getProducts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getProduct', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar produto:", error);
    },
  })
}