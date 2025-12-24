// app/entrada-chave-acesso/api/use-get-unidades-produtos.tsx

import { useQuery } from '@tanstack/react-query';
import EntradaChaveAcessoApi from '@/api/entrada-chave-acesso.api';

export function useGetUnidadesProdutos() {
  return useQuery({
    queryKey: ['getUnidadesProdutos'],
    queryFn: async () => {
      return EntradaChaveAcessoApi.getUnidadesProdutos();
    },
  });
}