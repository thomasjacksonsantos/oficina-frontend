// app/entrada-chave-acesso/api/use-consultar-por-chave.tsx

import EntradaChaveAcessoApi from '@/api/entrada-chave-acesso.api';
import { ConsultaChaveAcessoInput } from '@/api/entrada-chave-acesso.types';
import { useMutation } from '@tanstack/react-query';

export function useConsultarPorChave() {
  return useMutation({
    mutationFn: async (input: ConsultaChaveAcessoInput) => {
      return EntradaChaveAcessoApi.consultarPorChaveAcesso(input);
    },
    onError: (error) => {
      console.error('Erro ao consultar por chave de acesso:', error);
    },
  });
}