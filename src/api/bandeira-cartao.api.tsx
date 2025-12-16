import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import { CreateBandeiraCartaoInput, BandeiraCartao, UpdateBandeiraCartaoInput } from './bandeira-cartao.types';

const ENDPOINT = 'v1/bandeiras-cartao';

class BandeirasCartaoApi extends BaseApi {
  async getBandeirasCartao(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<BandeiraCartao>>(`${ENDPOINT}/all`, queryString, options);
  }

  async getBandeiraCartaoById(id: string) {
    return this.get<BandeiraCartao>(`${ENDPOINT}/${id}`);
  }

  async createBandeiraCartao(bandeiraCartao: CreateBandeiraCartaoInput) {
    return this.post<BandeiraCartao>(ENDPOINT, bandeiraCartao);
  }

  async updateBandeiraCartao(bandeiraCartao: UpdateBandeiraCartaoInput, id: string) {
    return this.post<CreateBandeiraCartaoInput>(`${ENDPOINT}/edit/${id}`, bandeiraCartao);
  }

  async deleteBandeiraCartao(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}`);
  }

  async activeBandeiraCartao(id: string) {
    return this.put<void>(`${ENDPOINT}/${id}/activar`, {});
  }

  async deactiveBandeiraCartao(id: string) {
    return this.delete<void>(`${ENDPOINT}/${id}/desactivar`);
  }
}

export default new BandeirasCartaoApi() as BandeirasCartaoApi;