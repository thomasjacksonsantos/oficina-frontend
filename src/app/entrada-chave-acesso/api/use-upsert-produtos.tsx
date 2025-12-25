// app/entrada-chave-acesso/api/use-upsert-produtos.tsx

import EntradaChaveAcessoApi from '@/api/entrada-chave-acesso.api';
import { UpsertProdutosInput } from '@/api/entrada-chave-acesso.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpsertProdutos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lojaId, input }: { lojaId: string; input: UpsertProdutosInput }) => {
      return EntradaChaveAcessoApi.upsertProdutosPorNotaFiscal(lojaId, input);
    },
    onSuccess: async () => {
      // Ensure the listing is refreshed immediately after upsert
      await queryClient.invalidateQueries({
        queryKey: ['getNotasFiscais'],
      });
      // Force refetch of matching queries to update UI without a manual refresh
      await queryClient.refetchQueries({ queryKey: ['getNotasFiscais'], exact: false });
    },
    onError: (error) => {
      console.error('Erro ao salvar produtos:', error);
    },
  });
}
