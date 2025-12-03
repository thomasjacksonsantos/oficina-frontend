import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProductsApi from "@/api/product.api";
import { CreateProductInput } from "@/api/product.types";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProductInput) => 
      ProductsApi.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProducts'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar produto:", error);
    },
  })
}