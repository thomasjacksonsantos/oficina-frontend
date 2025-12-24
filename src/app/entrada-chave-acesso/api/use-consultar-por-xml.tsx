// app/entrada-chave-acesso/api/use-consultar-por-xml.tsx

import EntradaChaveAcessoApi from '@/api/entrada-chave-acesso.api';
import { ConsultaXmlInput } from '@/api/entrada-chave-acesso.types';
import { useMutation } from '@tanstack/react-query';

export function useConsultarPorXml() {
  return useMutation({
    mutationFn: async (input: ConsultaXmlInput) => {
      return EntradaChaveAcessoApi.consultarPorXml(input);
    },
    onError: (error) => {
      console.error('Erro ao consultar por XML:', error);
    },
  });
}