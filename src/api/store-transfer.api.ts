// api/store-transfer.api.ts

import { Page } from '@/typings/page.types';
import { BaseApi } from './base.api';
import {
  CreateStoreTransferInput,
  StoreTransfer,
  StoreTransferDetail,
  StoreInfo,
  UpdateStoreTransferInput,
} from './store-transfer.types';

const ENDPOINT = 'v1/transferencias-estoque';
const STORES_ENDPOINT = 'v1/lojas';

class StoreTransfersApi extends BaseApi {
  async getStoreTransfers(queryString?: Record<string, any>, options?: { signal?: AbortSignal }) {
    return await this.get<Page<StoreTransfer>>(
      `${ENDPOINT}/all`,
      {
        pagina: queryString?.pagina,
        totalPagina: queryString?.totalPagina,
        q: queryString?.q,
        lojaOrigemId: queryString?.lojaOrigemId,
        lojaDestinoId: queryString?.lojaDestinoId,
        dataInicio: queryString?.dataInicio,
        dataFim: queryString?.dataFim,
      },
      options
    );
  }

  async getStoreTransferById(id: string) {
    return this.get<StoreTransferDetail>(`${ENDPOINT}/${id}`);
  }

  async createStoreTransfer(storeTransfer: CreateStoreTransferInput) {
    return this.post<StoreTransfer>(ENDPOINT, storeTransfer);
  }

  async updateStoreTransfer(storeTransfer: UpdateStoreTransferInput) {
    return this.put<StoreTransfer>(ENDPOINT, storeTransfer);
  }

  async getAllStores() {
    return this.get<StoreInfo[]>(`${STORES_ENDPOINT}/all/info`);
  }
}

export default new StoreTransfersApi() as StoreTransfersApi;
