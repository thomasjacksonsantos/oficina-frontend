import SuppliersApi from "@/api/supplier.api";
import { UpdateSupplierInput } from "@/api/supplier.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMockSupplier } from "../mock-data";

const USE_MOCK_DATA = true;

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, supplier }: { id: string, supplier: UpdateSupplierInput }) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clean up empty optional fields
        const cleanedSupplier = { ...supplier };
        if (cleanedSupplier.site === '') cleanedSupplier.site = undefined;
        if (cleanedSupplier.inscricaoEstadual === '') cleanedSupplier.inscricaoEstadual = undefined;
        if (cleanedSupplier.inscricaoMunicipal === '') cleanedSupplier.inscricaoMunicipal = undefined;
        if (cleanedSupplier.endereco?.complemento === '') {
          cleanedSupplier.endereco = { ...cleanedSupplier.endereco, complemento: undefined };
        }
        
        const result = updateMockSupplier(id, cleanedSupplier as any);
        if (!result) throw new Error('Fornecedor não encontrado');
        return result;
      }
      return SuppliersApi.updateSupplier(supplier, id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getSuppliers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getSupplier', variables.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar fornecedor:", error);
    },
  })
}