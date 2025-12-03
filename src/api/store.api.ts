import { BaseApi } from './base.api';
import { Store, UpdateStoreInput } from './store.types';

const ENDPOINT = 'v1/lojas';

class StoreApi extends BaseApi {
  async getStore() {
    return this.get<Store>(`${ENDPOINT}`);
  }

  async updateStore(store: UpdateStoreInput) {
    return this.put<Store>(`${ENDPOINT}`, store);
  }

  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('logo', file);

    // return this.post<{ url: string }>(`${ENDPOINT}/logo`, formData, {
    // headers: {
    // 'Content-Type': 'multipart/form-data',
    // },
    // });
  }

  async deleteLogo() {
    return this.delete<void>(`${ENDPOINT}/logo`);
  }

  async searchCep(cep: string) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      throw error;
    }
  }
}

export default new StoreApi() as StoreApi;
