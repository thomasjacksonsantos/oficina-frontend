import { BaseApi } from './base.api';
import { Store, UpdateStoreInput } from './store.types';

const ENDPOINT = 'v1/loja';

class StoreApi extends BaseApi {
  /**
   * Get current user's store information
   */
  async getStore() {
    return this.get<Store>(`${ENDPOINT}`);
  }

  /**
   * Update current user's store information
   */
  async updateStore(store: UpdateStoreInput) {
    return this.put<Store>(`${ENDPOINT}`, store);
  }

  /**
   * Upload store logo
   * @param file - Image file to upload
   */
  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('logo', file);

    // return this.post<{ url: string }>(`${ENDPOINT}/logo`, formData, {
    // headers: {
    // 'Content-Type': 'multipart/form-data',
    // },
    // });
  }

  /**
   * Delete store logo
   */
  async deleteLogo() {
    return this.delete<void>(`${ENDPOINT}/logo`);
  }

  /**
   * Search address by CEP using ViaCEP API
   * @param cep - Brazilian postal code (8 digits)
   */
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
