import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockStore, updateMockStore } from './mock-data/store-mock-data';
import { UpdateStoreInput } from '@/api/store.types';
import StoreApi from '@/api/store.api';

const USE_MOCK_DATA = false;

export function useGetStore() {
  return useQuery({
    queryKey: ['store'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return getMockStore();
      }
      return StoreApi.getStore();
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (store: UpdateStoreInput) => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Clean up empty optional fields
        const cleanedStore = { ...store };
        if (cleanedStore.inscricaoEstadual === '') cleanedStore.inscricaoEstadual = undefined;
        if (cleanedStore.inscricaoMunicipal === '') cleanedStore.inscricaoMunicipal = undefined;
        if (cleanedStore.site === '') cleanedStore.site = undefined;
        if (cleanedStore.logo === '') cleanedStore.logo = undefined;
        if (cleanedStore.endereco?.complemento === '') {
          cleanedStore.endereco = { ...cleanedStore.endereco, complemento: undefined };
        }

        return updateMockStore(cleanedStore);
      }
      return StoreApi.updateStore(store);
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
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Simulate file upload by creating local URL
        return { url: URL.createObjectURL(file) };
      }
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
