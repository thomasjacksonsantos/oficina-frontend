// app/entrada-chave-acesso/api/use-get-grupos-produtos.tsx

import { useQuery } from '@tanstack/react-query';
import EntradaChaveAcessoApi from '@/api/entrada-chave-acesso.api';

export function useGetGruposProdutos() {
  return useQuery({
    queryKey: ['getGruposProdutos'],
    queryFn: async () => {
      return EntradaChaveAcessoApi.getGruposProdutos();
    },
  });
}