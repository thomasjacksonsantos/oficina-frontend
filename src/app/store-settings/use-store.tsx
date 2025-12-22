import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateStoreInput } from '@/api/store.types';
import StoreApi from '@/api/store.api';
import CepApi from '@/api/cep.api';

export function useGetStore() {
  return useQuery({
    queryKey: ['store'],
    queryFn: async () => {
      return StoreApi.getStore();
    },
  });
}

export function useUpdateStore() {
  console.log('Updating store with data: out');
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, store }: { id?: string; store: UpdateStoreInput }) => {
      console.log('Updating store with data:', store);
      return StoreApi.updateStore(store, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['store'],
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar loja:', error);
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      return StoreApi.uploadLogo(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['store'],
      });
    },
    onError: (error) => {
      console.error('Erro ao fazer upload do logo:', error);
    },
  });
}

export function useSearchCep() {
  return useMutation({
    mutationFn: async (cep: string) => {
      // Always use real ViaCEP API (free public service)
      return StoreApi.searchCep(cep);
    },
  });
}

export function useGetCep(cep: string) {
  return useQuery({
    queryKey: ['getCep', cep],
    queryFn: ({ signal }) => CepApi.getCep(cep),
    enabled: !!cep,
  });
}
