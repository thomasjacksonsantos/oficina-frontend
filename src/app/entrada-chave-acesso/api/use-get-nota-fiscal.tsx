// app/entrada-chave-acesso/api/use-get-nota-fiscal.tsx

import EntradaChaveAcessoApi from '@/api/entrada-chave-acesso.api';
import { useMutation } from '@tanstack/react-query';

export function useGetNotaFiscal() {
  return useMutation({
    mutationFn: async (id: string) => {
      return EntradaChaveAcessoApi.getNotaFiscalById(id);
    },
  });
}